import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { GeminiService } from '../gemini/gemini.service';
import { generateRandomString } from '@app/common/utils/randomStringUtils';
import { Cron, CronExpression } from '@nestjs/schedule';

/**
 * Service responsible for authentication and getting access token
 */
@Injectable()
export class DataCrawlerService {
  private readonly logger = new Logger(DataCrawlerService.name);
  private readonly apiEndpoint: string;
  private readonly authConfig: Record<string, string>;
  private accessToken: string;
  private isRefreshing = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly geminiService: GeminiService
  ) {
    this.apiEndpoint = this.configService.get<string>('DATA_CRAWLER_API_ENDPOINT');
    this.authConfig = {
      username: this.configService.get<string>('AUTH_USERNAME'),
      password: this.configService.get<string>('AUTH_PASSWORD'),
      tenantCode: this.configService.get<string>('AUTH_TENANT_CODE'),
      clientId: this.configService.get<string>('AUTH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('AUTH_CLIENT_SECRET'),
      authType: this.configService.get<string>('AUTH_TYPE'),
      grantType: this.configService.get<string>('AUTH_GRANT_TYPE'),
    };
    // Initialize access token on service creation
    this.initializeAccessToken();
  }

  /**
   * Initialize access token when service starts
   */
  private async initializeAccessToken(): Promise<void> {
    try {
      this.logger.log('Initializing access token...');
      this.accessToken = await this.getAccessToken();
      this.logger.log('Access token initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize access token:', error.message);
    }
  }

  /**
   * Cron job to refresh access token every 23 hours
   * Only runs if no valid token exists
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  async scheduledRefreshAccessToken(): Promise<void> {
    if (!this.accessToken && !this.isRefreshing) {
      try {
        this.logger.log('Starting scheduled access token refresh...');
        this.isRefreshing = true;
        this.accessToken = await this.getAccessToken();
        this.logger.log('Access token refreshed successfully via scheduled job');
      } catch (error) {
        this.logger.error('Failed to refresh access token via scheduled job:', error.message);
      } finally {
        this.isRefreshing = false;
      }
    } else {
      this.logger.log('Skipping scheduled refresh - token exists or refresh in progress');
    }
  }

  /**
   * Get current access token (from memory or refresh if needed)
   */
  public async getCurrentAccessToken(): Promise<string> {
    if (!this.accessToken) {
      this.logger.log('No access token available, fetching new one...');
      this.accessToken = await this.getAccessToken();
    }
    return this.accessToken;
  }

  /**
   * Force refresh access token (called when token expires)
   */
  public async forceRefreshAccessToken(): Promise<string> {
    try {
      this.logger.log('Force refreshing access token due to expiration...');
      this.isRefreshing = true;
      this.accessToken = await this.getAccessToken();
      this.logger.log('Access token force refreshed successfully');
      return this.accessToken;
    } catch (error) {
      this.logger.error('Failed to force refresh access token:', error.message);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Check if token is valid by making a test API call
   * If token expires, automatically refresh it
   */
  public async validateAndGetToken(): Promise<string> {
    if (!this.accessToken) {
      return this.getCurrentAccessToken();
    }

    try {
      return this.accessToken;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logger.warn('Token expired, forcing refresh...');
        return this.forceRefreshAccessToken();
      }
      throw error;
    }
  }

  /**
   * Retrieves a captcha image and generates a random key for authentication
   * @returns Promise with object containing captcha text and generated key
   * @throws Error if captcha retrieval or text recognition fails
   */
  private async getVcToken() {
    const captchaKey = generateRandomString(this.configService.get<string>('CAPTCHA_KEY'));
    const url = `${this.apiEndpoint}/neurongateway/neuron/captcha?key=${captchaKey}`;
    const response = await firstValueFrom(this.httpService.get(url, { responseType: 'arraybuffer' }));
    const base64 = Buffer.from(response.data).toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64}`;
    const captchaText = await this.geminiService.readCaptcha(imageDataUrl);
    return { captchaText, captchaKey };
  }

  /**
   * Exchanges captcha code and key for an access token using OAuth2 flow
   * @param code - The captcha text recognized from the image
   * @param captchaKey - The random key used to generate the captcha image
   * @returns Promise with the OAuth token response containing access_token
   * @throws Error if token exchange fails or authentication credentials are invalid
   */
  private async crawlAccessToken(code: string, captchaKey: string) {
    const url = `${this.apiEndpoint}/neurongateway/neuron/oauth/token`;
    const body = qs.stringify({
      username: this.authConfig.username,
      password: this.authConfig.password,
      vc_code: code,
      vc_token: captchaKey,
      tenant_code: this.authConfig.tenantCode,
      grant_type: this.authConfig.grantType,
      client_id: this.authConfig.clientId,
      client_secret: this.authConfig.clientSecret,
      auth_type: this.authConfig.authType,
    });
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    try {
      const response = await firstValueFrom(this.httpService.post(url, body, { headers }));

      return response?.data ?? [];
    } catch (error) {
      this.logger.error(`Failed to fetch data from ${url}:`, error.message);
      throw error;
    }
  }

  /**
   * Main method to get access token by solving captcha and authenticating
   * @returns Promise with the access token
   */
  public async getAccessToken(): Promise<string> {
    try {
      const { captchaText, captchaKey } = await this.getVcToken();
      const tokenResponse = await this.crawlAccessToken(captchaText, captchaKey);
      return tokenResponse.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get access token:', error.message);
      throw error;
    }
  }
}

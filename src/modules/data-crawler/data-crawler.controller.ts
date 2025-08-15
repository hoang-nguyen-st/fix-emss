import { Controller, Post, Get, UseGuards } from '@nestjs/common';
import { DataCrawlerService } from './data-crawler.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';

@ApiTags('Data Crawler')
@Controller('data-crawler')
@UseGuards(JwtAccessTokenGuard)
export class DataCrawlerController {
  constructor(private readonly dataCrawlerService: DataCrawlerService) {}

  @Post('get-access-token')
  @ApiOperation({ summary: 'Get access token by solving captcha and authenticating' })
  @ApiResponse({ status: 200, description: 'Access token retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAccessToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.getAccessToken();
    return { accessToken };
  }

  @Get('current-access-token')
  @ApiOperation({ summary: 'Get current cached access token' })
  @ApiResponse({ status: 200, description: 'Current access token retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getCurrentAccessToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.getCurrentAccessToken();
    return { accessToken };
  }

  @Post('force-refresh-token')
  @ApiOperation({ summary: 'Force refresh access token (bypass cache)' })
  @ApiResponse({ status: 200, description: 'Access token force refreshed successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async forceRefreshToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.forceRefreshAccessToken();
    return { accessToken };
  }

  @Get('validate-token')
  @ApiOperation({ summary: 'Validate current token and refresh if expired' })
  @ApiResponse({ status: 200, description: 'Token validated successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async validateToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.validateAndGetToken();
    return { accessToken };
  }
}

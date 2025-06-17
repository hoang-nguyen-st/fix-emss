import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;
  private readonly model: GenerativeModel;
  private readonly captchaPrompt =
    'What is the text in this captcha image? result only 4 words, no additional words and no space.';

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    const modelName = this.configService.get<string>('GEMINI_VERSION');

    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: modelName });
  }

  /**
   * Reads captcha text from a base64 image using Gemini Vision
   * @param base64Image - Base64 encoded image string
   * @returns Extracted captcha text
   */
  async readCaptcha(base64Image: string): Promise<string> {
    try {
      const base64Data = base64Image.split(',')[1] || base64Image;

      const result = await this.model.generateContent([
        this.captchaPrompt,
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Data,
          },
        },
      ]);

      const text = result.response.text().trim();
      this.logger.debug(`Captcha text extracted: ${text}`);

      return text;
    } catch (error) {
      this.logger.error('Error reading captcha:', error.message);
      throw error;
    }
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class GeminiService {
  private readonly logger = new Logger(GeminiService.name);
  private readonly genAI: GoogleGenerativeAI;

  constructor(private readonly configService: ConfigService) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  /**
   * Reads captcha text from a base64 image using Gemini Vision
   * @param base64Image - Base64 encoded image string
   * @returns Promise with the extracted captcha text
   */
  async readCaptcha(base64Image: string): Promise<string> {
    console.log(base64Image);
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = 'What is the text in this captcha image? result only 4 words, no additional words and no space.';

      const result = await model.generateContent([
        prompt,
        {
          inlineData: {
            mimeType: 'image/png',
            data: base64Image.split(',')[1],
          },
        },
      ]);

      const response = await result.response;
      const text = response.text().trim();

      this.logger.debug(`Captcha text extracted: ${text}`);
      return text;
    } catch (error) {
      this.logger.error('Error reading captcha:', error.message);
      throw error;
    }
  }
}

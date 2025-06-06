import { Controller, Post } from '@nestjs/common';
import { DataCrawlerService } from './data-crawler.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Data Crawler')
@Controller('data-crawler')
// @UseGuards(JwtAccessTokenGuard)
export class DataCrawlerController {
  constructor(private readonly dataCrawlerService: DataCrawlerService) {}

  @Post('trigger')
  @ApiOperation({ summary: 'Trigger data crawling process manually' })
  @ApiResponse({ status: 200, description: 'Crawling process started successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async triggerCrawl(): Promise<void> {
    await this.dataCrawlerService.triggerCrawl();
  }
}

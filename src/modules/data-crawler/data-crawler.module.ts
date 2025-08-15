import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { DataCrawlerService } from './data-crawler.service';
import { DataCrawlerController } from './data-crawler.controller';
import { ConfigService } from '@nestjs/config';
import { GeminiModule } from '../gemini/gemini.module';

@Module({
  imports: [ScheduleModule.forRoot(), HttpModule, GeminiModule],
  controllers: [DataCrawlerController],
  providers: [DataCrawlerService, ConfigService],
  exports: [DataCrawlerService],
})
export class DataCrawlerModule {}

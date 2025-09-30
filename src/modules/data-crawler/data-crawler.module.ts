import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataCrawlerService } from './data-crawler.service';
import { DataCrawlerController } from './data-crawler.controller';
import { ConfigService } from '@nestjs/config';
import { GeminiModule } from '../gemini/gemini.module';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    GeminiModule,
    TypeOrmModule.forFeature([DeviceEntity, WorkspaceEntity, LocationDeviceEntity]),
  ],
  controllers: [DataCrawlerController],
  providers: [DataCrawlerService, ConfigService],
  exports: [DataCrawlerService],
})
export class DataCrawlerModule {}

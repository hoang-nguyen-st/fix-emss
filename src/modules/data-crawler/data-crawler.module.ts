import { Module, forwardRef } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataCrawlerService } from './data-crawler.service';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { GeminiModule } from '../gemini/gemini.module';
import { TimeSlotEntity } from '@app/modules/price-types/entities/time-slot.entity';
import { AmigoModule } from '@app/modules/amigo/amigo.module';
import { InvoicesModule } from '@app/modules/invoices/invoices.module';

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    TypeOrmModule.forFeature([DeviceEntity, WorkspaceEntity, LocationDeviceEntity, TimeSlotEntity]),
    GeminiModule,
    forwardRef(() => AmigoModule),
    forwardRef(() => InvoicesModule),
  ],
  providers: [DataCrawlerService],
  exports: [DataCrawlerService],
})
export class DataCrawlerModule {}

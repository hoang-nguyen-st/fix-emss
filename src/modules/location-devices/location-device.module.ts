import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationDeviceEntity } from './entities/location-device.entity';
import { LocationDeviceService } from './location-device.service';

@Module({
  imports: [TypeOrmModule.forFeature([LocationDeviceEntity])],
  providers: [LocationDeviceService],
  exports: [LocationDeviceService],
})
export class LocationDeviceModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationDeviceEntity } from './entities/location-device.entity';
import { LocationDeviceService } from './location-device.service';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationDeviceEntity, LocationEntity])],
  providers: [LocationDeviceService],
  exports: [LocationDeviceService],
})
export class LocationDeviceModule {}

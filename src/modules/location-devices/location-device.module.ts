import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationDeviceEntity } from './entities/location-device.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationDeviceEntity])],
  exports: [TypeOrmModule],
})
export class LocationDeviceModule {}

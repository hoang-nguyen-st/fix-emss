import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { DeviceEntity } from './entities/device.entity';
import { DeviceService } from './devices.service';
import { DeviceController } from './devices.controller';
import { LocationsModule } from '../locations/locations.module';
import { AmigoModule } from '../amigo/amigo.module';

@Module({
  imports: [TypeOrmModule.forFeature([DeviceEntity]), LocationsModule, AmigoModule],
  controllers: [DeviceController],
  providers: [DeviceService],
  exports: [DeviceService],
})
export class DevicesModule {}

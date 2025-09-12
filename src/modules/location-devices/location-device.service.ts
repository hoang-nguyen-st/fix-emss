import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationDeviceEntity } from './entities/location-device.entity';
import { DeviceWithInitDto } from '@app/modules/devices/interface/detail-telemetry-device.interface';

@Injectable()
export class LocationDeviceService {
  constructor(
    @InjectRepository(LocationDeviceEntity)
    private locationDeviceRepository: Repository<LocationDeviceEntity>
  ) {}

  async createLocationDeviceRelationships(
    locationId: string,
    devices: DeviceWithInitDto[]
  ): Promise<LocationDeviceEntity[]> {
    try {
      console.log('Creating location-device relationships:', { locationId, devices });

      const locationDevices = devices.map((device) => {
        console.log('Creating location device:', {
          locationId,
          deviceId: device.deviceId,
          initialIndex: device.initialIndex,
        });
        return this.locationDeviceRepository.create({
          locationId,
          deviceId: device.deviceId,
          initialIndex: device.initialIndex,
          currentIndex: device.initialIndex,
          periodStartIndex: device.initialIndex,
        });
      });

      console.log('Saving location devices:', locationDevices);
      const result = await this.locationDeviceRepository.save(locationDevices);
      console.log('Saved location devices result:', result);

      return result;
    } catch (error) {
      console.error('Error creating location-device relationships:', error);
      throw error;
    }
  }
}

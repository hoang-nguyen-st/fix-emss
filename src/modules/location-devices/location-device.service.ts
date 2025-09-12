import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationDeviceEntity } from './entities/location-device.entity';
import { DeviceWithInitDto } from '@app/modules/devices/interface/detail-telemetry-device.interface';

@Injectable()
export class LocationDeviceService {
  constructor(
    @InjectRepository(LocationDeviceEntity)
    private locationDeviceRepository: Repository<LocationDeviceEntity>,
    private readonly logger: Logger
  ) {}

  async createLocationDeviceRelationships(
    locationId: string,
    devices: DeviceWithInitDto[]
  ): Promise<LocationDeviceEntity[]> {
    try {
      const locationDevices = devices.map((device) => {
        return this.locationDeviceRepository.create({
          locationId,
          deviceId: device.deviceId,
          initialIndex: device.initialIndex,
          currentIndex: device.initialIndex,
          periodStartIndex: device.initialIndex,
        });
      });

      const result = await this.locationDeviceRepository.save(locationDevices);

      return result;
    } catch (error) {
      this.logger.error('Error creating location-device relationships:', error);
      throw error;
    }
  }
}

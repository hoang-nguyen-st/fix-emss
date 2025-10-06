import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationDeviceEntity } from './entities/location-device.entity';
import { DeviceWithInitDto } from '@app/modules/devices/interface/detail-telemetry-device.interface';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { LocationTypeEnum } from '@app/common/constants/enums';

@Injectable()
export class LocationDeviceService {
  private readonly logger = new Logger(LocationDeviceService.name);

  constructor(
    @InjectRepository(LocationDeviceEntity)
    private locationDeviceRepository: Repository<LocationDeviceEntity>,
    @InjectRepository(LocationEntity)
    private locationRepository: Repository<LocationEntity>
  ) {}

  async createLocationDeviceRelationships(
    locationId: string,
    devices: DeviceWithInitDto[]
  ): Promise<LocationDeviceEntity[]> {
    try {
      const location = await this.locationRepository.findOne({
        where: { id: locationId },
        relations: ['locationType'],
      });
      if (!location) {
        throw new BadRequestException('Địa điểm không tìm thấy!');
      }

      const isResidential = location.locationType?.locationTypeEnum === LocationTypeEnum.RESIDENTIAL;

      if (isResidential) {
        if (devices.length > 1) {
          throw new BadRequestException('Hộ gia đình chỉ có duy nhất 1 thiết bị');
        }
        const existingCount = await this.locationDeviceRepository.count({ where: { locationId } });
        if (existingCount >= 1) {
          throw new BadRequestException('Hộ gia đình đã có thiết bị!');
        }
      }

      const locationDevices = devices.map((device) => {
        return this.locationDeviceRepository.create({
          locationId,
          deviceId: device.deviceId,
          initialIndex: device.initialIndex,
          currentIndex: device.initialIndex,
          periodStartIndex: device.initialIndex,
          weekdayMidPeak: isResidential ? 0 : device.initialIndex,
          weekdayOffPeak: isResidential ? 0 : device.initialIndex,
          weekdayPeak: isResidential ? 0 : device.initialIndex,
          weekendMidPeak: isResidential ? 0 : device.initialIndex,
          weekendOffPeak: isResidential ? 0 : device.initialIndex,
          periodWeekdayOffPeak: device.initialIndex,
          periodWeekdayMidPeak: device.initialIndex,
          periodWeekdayPeak: device.initialIndex,
          periodWeekendOffPeak: device.initialIndex,
          periodWeekendMidPeak: device.initialIndex,
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

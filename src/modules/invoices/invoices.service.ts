import { InvoiceEntity } from '@Entity/index';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationDeviceEntity } from '../location-devices/entities';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { LocationTypeEnum } from '@Constant/enums';
import { CalculateElectricDto } from './dto/request/calculate-electric.dto';
import { ResponseItem } from '@app/common/dtos/response-item.dto';
import { InvoiceStrategyFactory } from './strategies/invoice-strategy.factory';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(LocationDeviceEntity)
    private readonly locationDeviceRepository: Repository<LocationDeviceEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,

    private readonly invoiceStrategyFactory: InvoiceStrategyFactory
  ) {}

  async calculateElectric(dto: CalculateElectricDto) {
    const { locationId, startDate, endDate } = dto;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : new Date();

    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    const location = await this.locationRepository.findOne({
      where: { id: locationId },
      relations: ['locationType'],
    });

    if (!location) {
      throw new NotFoundException('Địa điểm không tồn tại');
    }

    const locationDevices = await this.locationDeviceRepository.find({
      where: { locationId: location.id },
      relations: {
        device: true,
      },
    });

    if (!locationDevices || locationDevices.length === 0) {
      throw new NotFoundException('Không tìm thấy đồng hồ nào cho địa điểm');
    }

    const locationTypeEnum: LocationTypeEnum | undefined = location.locationType?.locationTypeEnum as
      | LocationTypeEnum
      | undefined;

    if (!locationTypeEnum) {
      throw new BadRequestException('Không xác định được loại hình thức của địa điểm');
    }

    if (locationTypeEnum === LocationTypeEnum.RESIDENTIAL && locationDevices.length > 1) {
      throw new BadRequestException('Hộ sinh hoạt chỉ được phép có duy nhất 1 thiết bị');
    }

    const devicesToProcess = locationTypeEnum === LocationTypeEnum.RESIDENTIAL ? [locationDevices[0]] : locationDevices;

    const locationTypeId = location.locationTypeId;
    const effectiveWorkspaceId = location.workspaceId ?? devicesToProcess[0]?.device?.workspaceId;

    const strategy = this.invoiceStrategyFactory.getStrategy(locationTypeEnum);
    const result = await strategy.calculate(devicesToProcess, effectiveWorkspaceId, locationTypeId, start, end);

    const totalConsumption = devicesToProcess.reduce((sum, ld) => {
      const initIndex = ld.initialIndex;
      const currIndex = ld.currentIndex;
      if (initIndex == null || currIndex == null) return sum;
      return sum + (Number(currIndex) - Number(initIndex));
    }, 0);

    return new ResponseItem({ totalConsumption, ...result });
  }
}

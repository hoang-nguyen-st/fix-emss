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
import { InvoiceItemEntity } from './entities/invoice-item.entity';
import { InvoiceItemTypeEnum, InvoiceStatusEnum, InvoiceTypeEnum, LocationTypeEnum as LT } from '@Constant/enums';

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
    const { locationId } = dto;

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
    const result = await strategy.calculate(devicesToProcess, effectiveWorkspaceId, locationTypeId);

    const totalConsumption = devicesToProcess.reduce((sum, ld) => {
      const initIndex = ld.initialIndex;
      const currIndex = ld.currentIndex;
      if (initIndex == null || currIndex == null) return sum;
      return sum + (Number(currIndex) - Number(initIndex));
    }, 0);

    return new ResponseItem({ totalConsumption, ...result });
  }

  async generateAndSaveMonthlyInvoice(locationId: string, periodStart: Date, periodEnd: Date) {
    const start = new Date(periodStart);
    const end = new Date(periodEnd);
    end.setHours(23, 59, 59, 999);

    const location = await this.locationRepository.findOne({ where: { id: locationId }, relations: ['locationType'] });
    if (!location) throw new NotFoundException('Địa điểm không tồn tại');

    const locationDevices = await this.locationDeviceRepository.find({
      where: { locationId },
      relations: { device: true },
    });
    if (!locationDevices?.length) throw new NotFoundException('Không tìm thấy đồng hồ nào cho địa điểm');

    const locationTypeEnum: LocationTypeEnum | undefined = location.locationType?.locationTypeEnum as
      | LocationTypeEnum
      | undefined;
    if (!locationTypeEnum) throw new BadRequestException('Không xác định được loại hình thức của địa điểm');

    if (locationTypeEnum === LT.RESIDENTIAL && locationDevices.length > 1) {
      throw new BadRequestException('Hộ sinh hoạt chỉ được phép có duy nhất 1 thiết bị');
    }

    const devicesToProcess = locationTypeEnum === LT.RESIDENTIAL ? [locationDevices[0]] : locationDevices;
    const locationTypeId = location.locationTypeId;
    const effectiveWorkspaceId = location.workspaceId ?? devicesToProcess[0]?.device?.workspaceId;

    const strategy = this.invoiceStrategyFactory.getStrategy(locationTypeEnum);
    const calc = await strategy.calculate(devicesToProcess, effectiveWorkspaceId, locationTypeId);

    const invoice = this.invoiceRepository.create({
      invoiceType:
        locationTypeEnum === LT.RESIDENTIAL
          ? InvoiceTypeEnum.HOUSEHOLD
          : locationTypeEnum === LT.BUSINESS
          ? InvoiceTypeEnum.BUSINESS
          : InvoiceTypeEnum.PRODUCTION,
      effectiveFrom: start,
      effectiveTo: end,
      totalConsumption: devicesToProcess.reduce((sum, ld) => {
        const initIndex = ld.initialIndex;
        const currIndex = ld.currentIndex;
        if (initIndex == null || currIndex == null) return sum;
        return sum + (Number(currIndex) - Number(initIndex));
      }, 0),
      subtotal: calc.totalPrice,
      vatRate: 10,
      vatAmount: Math.round((calc.totalPrice * 10) / 100),
      totalAmount: Math.round(calc.totalPrice * 1.1),
      dueDate: new Date(end.getFullYear(), end.getMonth() + 1, 10),
      status: InvoiceStatusEnum.DRAFT,
      locationId: locationId,
      notes: null,
    });

    const items: InvoiceItemEntity[] = [];
    if (locationTypeEnum === LT.RESIDENTIAL) {
      for (const d of calc.details as any[]) {
        const item = this.invoiceRepository.manager.create(InvoiceItemEntity, {
          itemType: InvoiceItemTypeEnum.TIER,
          itemName: `Bậc ${d.tierLevel}`,
          sortOrder: d.tierLevel,
          tierLevel: d.tierLevel,
          tariffTierId: null,
          timeUsageEnum: null,
          pricingRuleId: null,
          deviceId: null,
          deviceName: null,
          voltageValue: null,
          voltageLevel: null,
          initialIndex: null,
          currentIndex: null,
          consumption: d.kwh,
          unitPrice: d.unitPrice,
          amount: d.amount,
        });
        items.push(item);
      }
    } else {
      let order = 1;
      for (const d of calc.details as any[]) {
        const item = this.invoiceRepository.manager.create(InvoiceItemEntity, {
          itemType: InvoiceItemTypeEnum.DEVICE,
          itemName: d.name,
          sortOrder: order++,
          tierLevel: null,
          tariffTierId: null,
          timeUsageEnum: null,
          pricingRuleId: null,
          deviceId: d.id,
          deviceName: d.name,
          voltageValue: d.voltageValue ?? null,
          voltageLevel: d.voltageLevel ?? null,
          initialIndex: null,
          currentIndex: null,
          consumption: d.consumption,
          unitPrice: d.unitPrice,
          amount: d.amount,
        });
        items.push(item);
      }
    }

    invoice.items = items;
    await this.invoiceRepository.save(invoice);
    return invoice;
  }
}

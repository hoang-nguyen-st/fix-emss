import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDeviceDto } from '@app/modules/devices/dto/create-device.dto';
import { UpdateDeviceDto } from '@app/modules/devices/dto/update-device.dto';
import { GetDeviceDto, GetTelemetryDto } from '@app/modules/devices/dto/get-device';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { DeviceEntity } from './entities/device.entity';
import { DeviceTotalType } from '@app/modules/devices/interface/total-device.interface';
import { SettingDeviceDto } from '@app/modules/devices/dto/setting-device.dto';
import { DataCrawlerService } from '../data-crawler/data-crawler.service';
import { firstValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { VoltageUnitEnum } from '@Constant/enums';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DataCrawlerService.name);
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    private readonly dataCrawlerService: DataCrawlerService,
    private readonly httpService: HttpService
  ) {}

  async create(deviceDto: CreateDeviceDto) {
    const device = this.deviceRepository.create(deviceDto);
    return this.deviceRepository.save(device);
  }

  async findAll(params: GetDeviceDto) {
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.location', 'location');

    if (params.search !== undefined) {
      queryBuilder.where('unaccent(LOWER(device.name)) LIKE unaccent(LOWER(:name))', { name: `%${params.search}%` });
    }

    if (params.status !== undefined) {
      queryBuilder.andWhere('device.status = :status', { status: params.status });
    }

    if (params.deviceType !== undefined) {
      queryBuilder.andWhere('device.deviceType = :deviceType', { deviceType: params.deviceType });
    }

    if (params.location !== undefined) {
      queryBuilder.andWhere('location.id = :id', { id: params.location });
    }

    const [result, total] = await queryBuilder
      .orderBy(`device.${params.orderBy}`, params.order)
      .skip(params.skip)
      .take(params.take)
      .getManyAndCount();

    const devicesWithLocationName = result.map((device: any) => {
      const locationName = device.location?.name || null;
      return {
        id: device.id,
        devEUI: device.devEUI,
        deviceType: device.deviceType,
        name: device.name,
        status: device.status,
        voltageUnit: device.voltageUnit,
        voltageValue: device.voltageValue,
        fieldCalculate: device.fieldCalculate,
        createdAt: device.createdAt,
        locationName,
      };
    });

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(devicesWithLocationName, pageMetaDto, 'Lấy những thiết bị thành công!');
  }

  async findOne(id: string): Promise<ResponseItem<DeviceEntity>> {
    const device = await this.deviceRepository.findOne({
      where: { id },
      relations: {
        location: true,
        workspace: true,
      },
    });

    if (!device) {
      throw new NotFoundException(`Thiết bị với id là ${id} không tìm thấy`);
    }

    return new ResponseItem(device, 'Lấy thông tin thiết bị thành công!');
  }

  async update(id: string, deviceDto: UpdateDeviceDto) {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) {
      throw new NotFoundException(`Thiết bị với id là ${id} không tìm thấy`);
    }

    Object.assign(device, deviceDto);
    return this.deviceRepository.save(device);
  }

  async remove(id: string) {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) throw new NotFoundException(`Thiết bị với id là ${id} không tìm thấy`);

    return this.deviceRepository.remove(device);
  }

  async getDeviceByType(): Promise<ResponseItem<DeviceTotalType[]>> {
    const stats = await this.deviceRepository
      .createQueryBuilder('device')
      .select('device.deviceType', 'deviceType')
      .addSelect('COUNT(device.id)', 'count')
      .groupBy('device.deviceType')
      .getRawMany();

    const data = stats.map((stat) => ({
      deviceType: stat.deviceType,
      count: parseInt(stat.count),
    }));

    const total = data.reduce((acc, stat) => acc + stat.count, 0);

    data.push({ deviceType: 'total', count: total });
    return {
      message: 'Lấy thống kê loại thiết bị thành công!',
      data,
    };
  }

  async settingDevice(id: string, settingDeviceDto: SettingDeviceDto): Promise<ResponseItem<DeviceEntity>> {
    const device = await this.deviceRepository.findOne({ where: { id } });
    if (!device) throw new NotFoundException(`Thiết bị với id là ${id} không tìm thấy`);

    device.fieldCalculate = settingDeviceDto.fieldCalculate;
    device.deviceType = settingDeviceDto.deviceType;
    if (settingDeviceDto.voltageUnit !== undefined) {
      device.voltageUnit = settingDeviceDto.voltageUnit;
    }

    if (settingDeviceDto.voltageValue !== undefined) {
      if (
        (device.voltageUnit === VoltageUnitEnum.VOLT && settingDeviceDto.voltageValue > 500000) ||
        (device.voltageUnit === VoltageUnitEnum.KILOVOLT && settingDeviceDto.voltageValue > 500)
      ) {
        throw new BadRequestException(`Giá trị voltageValue vượt quá giới hạn cho đơn vị ${device.voltageUnit}`);
      }

      device.voltageValue = settingDeviceDto.voltageValue;
    }

    const updatedDevice = await this.deviceRepository.save(device);
    return new ResponseItem(updatedDevice, 'Cập nhật thiết bị thành công!');
  }

  async getTelemetryOfDevice(telemetryDto: GetTelemetryDto): Promise<ResponseItem<string[]>> {
    const { projectId, sensorId, systemType, sensorName } = telemetryDto;

    try {
      const url = `https://amigo.veep.vn/gateway/iot/api/IoTSensor/PageSensorDataByProject`;
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            projectId,
            sensorid: sensorId,
            systemType: systemType ?? 1,
            sensorname: sensorName,
          },
          headers: {
            Authorization: `Bearer ${this.dataCrawlerService.getAccessTokenForAnotherService()}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const fieldValueList = data?.data?.data?.[0]?.FieldList ?? [];

      return new ResponseItem(fieldValueList, 'Telemetry fetched successfully');
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException('Failed to fetch telemetry data from external API');
    }
  }
}

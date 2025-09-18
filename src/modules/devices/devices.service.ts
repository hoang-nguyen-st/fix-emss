import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
import { DetailTelemetryDeviceInterface } from './interface/detail-telemetry-device.interface';
import { AmigoService } from '../amigo/amigo.service';
import { GetTodayEnergyAnalyticsDto } from './interface/get-total-enegry-analytics.interface';

@Injectable()
export class DeviceService {
  private readonly logger = new Logger(DataCrawlerService.name);
  constructor(
    @InjectRepository(DeviceEntity)
    private deviceRepository: Repository<DeviceEntity>,
    private readonly dataCrawlerService: DataCrawlerService,
    private readonly httpService: HttpService,
    private readonly amigoService: AmigoService
  ) {}

  async getTodayEnergyAnalytics(params: GetTodayEnergyAnalyticsDto): Promise<any> {
    const { projectId, sensorId } = params;
    const interval = params.interval ?? '9999m';
    const systemType = params.systemType ?? 1;

    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const payload = {
      projectId,
      sensorId,
      interval,
      startTime: start.toISOString(),
      endTime: end.toISOString(),
      systemType,
    };

    return this.amigoService.getSingleAnalyticalChart(payload);
  }

  async create(deviceDto: CreateDeviceDto) {
    const device = this.deviceRepository.create(deviceDto);
    return this.deviceRepository.save(device);
  }

  async findAll(id: string, params: GetDeviceDto) {
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoinAndSelect('device.location', 'location')
      .where('device.workspace_id = :workspaceId', { workspaceId: id });

    if (params.search !== undefined) {
      queryBuilder.andWhere('unaccent(LOWER(device.name)) LIKE unaccent(LOWER(:name))', { name: `%${params.search}%` });
    }

    if (params.status !== undefined) {
      queryBuilder.andWhere('device.status = :status', { status: params.status });
    }

    if (params.deviceType !== undefined) {
      queryBuilder.andWhere('device.deviceType = :deviceType', { deviceType: params.deviceType });
    }

    if (params.location !== undefined) {
      queryBuilder.andWhere('location.id = :locationId', { locationId: params.location });
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

  async getDeviceByType(id: string): Promise<ResponseItem<DeviceTotalType[]>> {
    const stats = await this.deviceRepository
      .createQueryBuilder('device')
      .select('device.deviceType', 'deviceType')
      .addSelect('COUNT(device.id)', 'count')
      .where('device.workspace_id = :workspaceId', { workspaceId: id })
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
    const { projectId, sensorId, systemType } = telemetryDto;

    try {
      const url = `https://amigo.veep.vn/gateway/iot/api/IoTSensor/PageSensorDataByProject`;
      const { data } = await firstValueFrom(
        this.httpService.get(url, {
          params: {
            projectId,
            sensorid: sensorId,
            systemType: systemType ?? 1,
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

  async getUnassignedDevices(workspaceId: string, params: GetDeviceDto): Promise<ResponsePaginate<DeviceEntity[]>> {
    const queryBuilder = this.deviceRepository
      .createQueryBuilder('device')
      .leftJoin('device.locationDevices', 'locationDevices')
      .where('locationDevices.id IS NULL')
      .andWhere('device.workspaceId = :workspaceId', { workspaceId });

    if (params.search !== undefined) {
      queryBuilder.andWhere('unaccent(LOWER(device.name)) LIKE unaccent(LOWER(:name))', { name: `%${params.search}%` });
    }

    if (params.status !== undefined) {
      queryBuilder.andWhere('device.status = :status', { status: params.status });
    }

    if (params.deviceType !== undefined) {
      queryBuilder.andWhere('device.deviceType = :deviceType', { deviceType: params.deviceType });
    }

    const [devices, total] = await queryBuilder.skip(params.skip).take(params.take).getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(devices, pageMetaDto, 'Lấy danh sách thiết bị thành công!');
  }

  async getDevicesInfoByIds(
    workspaceId: string,
    ids: string
  ): Promise<ResponsePaginate<DetailTelemetryDeviceInterface>> {
    const devices = await this.deviceRepository.find({
      where: { id: In(ids.split(',').map((id) => id.trim())) },
    });

    const now = new Date();
    const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0, 0));
    const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 23, 59, 59, 999));

    const result = await Promise.all(
      devices.map(async (device) => {
        try {
          const analytics = await this.amigoService.getSingleAnalyticalChart({
            projectId: workspaceId,
            sensorId: device.sensorId,
            interval: '1d',
            startTime: start.toISOString(),
            endTime: end.toISOString(),
            systemType: 1,
          });

          const fieldData = analytics?.data?.[device?.fieldCalculate] as any[] | undefined;
          const value = Array.isArray(fieldData) && fieldData.length > 0 ? String(fieldData[0][1]) : null;
          return { device, lastestTimeSeriesValue: value };
        } catch {
          return { device, lastestTimeSeriesValue: null };
        }
      })
    );
    const pageMetaDto = new PageMetaDto({
      itemCount: devices.length,
      pageOptionsDto: { skip: 0, take: devices.length },
    });
    return new ResponsePaginate(result, pageMetaDto, 'Lấy danh sách thiết bị thành công!');
  }
}

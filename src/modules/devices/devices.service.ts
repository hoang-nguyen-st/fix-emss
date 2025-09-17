import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Like, Raw, Repository } from 'typeorm';
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

  async findAll(id: string, params: GetDeviceDto) {
    const { skip, take, search, deviceType, location, status } = params;

    const whereConditions: any = {
      workspaceId: id,
    };

    if (search !== undefined) {
      whereConditions.name = Raw((alias) => `unaccent(lower(${alias})) ILIKE unaccent(lower(:search))`, {
        search: `%${search}%`,
      });
    }

    if (status !== undefined) {
      whereConditions.status = status;
    }

    if (deviceType !== undefined) {
      whereConditions.deviceType = deviceType;
    }

    if (location !== undefined) {
      whereConditions.location = { id: location };
    }

    const [result, total] = await this.deviceRepository.findAndCount({
      where: {
        ...whereConditions,
      },
      select: {
        id: true,
        name: true,
        deviceType: true,
        fieldCalculate: true,
        status: true,
        locationDevices: {
          id: true,
          location: {
            name: true,
          },
        },
      },
      relations: {
        locationDevices: {
          location: true,
        },
      },
      skip: skip,
      take: take,
    });

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(result, pageMetaDto, 'Lấy những thiết bị thành công!');
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

    device.voltageUnit = settingDeviceDto.voltageUnit;
    device.voltageValue = settingDeviceDto.voltageValue;
    device.fieldCalculate = settingDeviceDto.fieldCalculate;
    device.deviceType = settingDeviceDto.deviceType;

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
}

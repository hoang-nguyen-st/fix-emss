import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { DeviceService } from '@app/modules/devices/devices.service';
import { CreateDeviceDto } from '@app/modules/devices/dto/create-device.dto';
import { UpdateDeviceDto } from '@app/modules/devices/dto/update-device.dto';
import { GetDeviceDto } from '@app/modules/devices/dto/get-device';
import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { DeviceTotalType } from '@app/modules/devices/interface/total-device.interface';
import { SettingDeviceDto } from '@app/modules/devices/dto/setting-device.dto';
import { DeviceEntity } from './entities/device.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@app/modules/auth/guards/jwt-access-token.guard';
import { DetailTelemetryDeviceInterface } from './interface/detail-telemetry-device.interface';

@ApiTags('Devices')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @Post()
  create(@Body() createDeviceDto: CreateDeviceDto) {
    return this.deviceService.create(createDeviceDto);
  }

  @Get()
  findAll(@Query() params: GetDeviceDto) {
    return this.deviceService.findAll(params);
  }

  @Get('summarize')
  getDeviceTypeStats(): Promise<ResponseItem<DeviceTotalType[]>> {
    return this.deviceService.getDeviceByType();
  }

  @Get('unassigned/:workspaceId')
  getUnassignedDevices(
    @Param('workspaceId') workspaceId: string,
    @Query() params: GetDeviceDto
  ): Promise<ResponsePaginate<DeviceEntity[]>> {
    return this.deviceService.getUnassignedDevices(workspaceId, params);
  }

  @Get('detail-by-ids/:workspaceId')
  getDevicesInfoByIds(
    @Param('workspaceId') workspaceId: string,
    @Query('ids') ids: string
  ): Promise<ResponsePaginate<DetailTelemetryDeviceInterface>> {
    return this.deviceService.getDevicesInfoByIds(workspaceId, ids);
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<ResponseItem<DeviceEntity>> {
    return this.deviceService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDeviceDto: UpdateDeviceDto) {
    return this.deviceService.update(id, updateDeviceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.deviceService.remove(id);
  }

  @Post(':id/setting-device')
  settingDevice(
    @Param('id') id: string,
    @Body() settingDeviceDto: SettingDeviceDto
  ): Promise<ResponseItem<DeviceEntity>> {
    return this.deviceService.settingDevice(id, settingDeviceDto);
  }

  @Post('energy-analytics/today')
  getTodayEnergyAnalytics(
    @Body()
    body: {
      projectId: string;
      sensorId: string;
      interval?: string;
      systemType?: number;
    }
  ) {
    return this.deviceService.getTodayEnergyAnalytics(body);
  }
}

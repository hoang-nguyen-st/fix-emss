import { DeviceTypeEnum, MeterTypeEnum } from '@Constant/enums';
import { IsBoolean, IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateDeviceDto {
  @IsUUID()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description: string;

  @IsEnum(DeviceTypeEnum)
  @IsOptional()
  deviceType: DeviceTypeEnum;

  @IsString()
  devEUI: string;

  @IsString()
  createdTime: string;

  @IsBoolean()
  @IsOptional()
  status: boolean;

  @IsEnum(MeterTypeEnum)
  @IsOptional()
  meterType: MeterTypeEnum;
}

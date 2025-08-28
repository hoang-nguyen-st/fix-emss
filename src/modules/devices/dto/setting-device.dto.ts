import { DeviceTypeEnum, VoltageUnitEnum } from '@Constant/enums';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class SettingDeviceDto {
  @IsString()
  @IsNotEmpty()
  fieldCalculate: string;

  @IsEnum(DeviceTypeEnum)
  @IsNotEmpty()
  deviceType: DeviceTypeEnum;

  @IsOptional()
  @IsEnum(VoltageUnitEnum)
  voltageUnit?: VoltageUnitEnum;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => Number(value))
  voltageValue?: number;
}

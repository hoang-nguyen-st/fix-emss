import { DeviceTypeEnum, VoltageUnitEnum } from '@Constant/enums';
import { Transform } from 'class-transformer';
import { IsEnum, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class SettingDeviceDto {
  @IsString()
  @IsNotEmpty()
  fieldCalculate: string;

  @IsEnum(DeviceTypeEnum)
  @IsNotEmpty()
  deviceType: DeviceTypeEnum;

  @IsNotEmpty()
  @IsEnum(VoltageUnitEnum)
  voltageUnit: VoltageUnitEnum;

  @IsNumber()
  @IsNotEmpty()
  @Transform(({ value }) => Number(value))
  voltageValue: number;
}

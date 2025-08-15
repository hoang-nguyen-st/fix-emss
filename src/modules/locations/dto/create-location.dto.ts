import { DeviceWithInitDto } from '@app/modules/devices/interface/detail-telemetry-device.interface';
import { IsArray, IsOptional, IsString } from 'class-validator';

export class CreateLocationDto {
  @IsString()
  name: string;

  @IsString()
  locationTypeId: string;

  @IsString()
  @IsOptional()
  priceTypeId: string;

  @IsString()
  initialDate: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  devices: DeviceWithInitDto[];
}

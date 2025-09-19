import { PageOptionsDto } from '@app/common/dtos';
import { IsNotEmpty, IsString } from 'class-validator';

export class DeviceDetailConsumptionDto extends PageOptionsDto {
  @IsNotEmpty()
  @IsString()
  interval: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;
}

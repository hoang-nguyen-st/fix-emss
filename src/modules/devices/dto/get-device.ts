import { IsOptional } from 'class-validator';
import { PageOptionsDto } from '@app/common/dtos';
import { DeviceType } from '@app/modules/devices/interface/device.interface';
import { ApiProperty } from '@nestjs/swagger';

export class GetDeviceDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  status: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  deviceType: DeviceType;

  @ApiProperty({ required: false })
  @IsOptional()
  location: string;
}

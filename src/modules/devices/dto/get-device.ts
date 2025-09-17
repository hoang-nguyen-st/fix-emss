import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
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

export class GetTelemetryDto {
  @ApiProperty({ required: true })
  @IsNotEmpty()
  @IsUUID()
  projectId: string;

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sensorId: string;

  @ApiProperty({ required: false })
  @IsOptional()
  systemType?: string;
}

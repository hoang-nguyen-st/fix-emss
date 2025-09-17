import { IsNotEmpty, IsOptional, IsUUID } from 'class-validator';
import { PageOptionsDto } from '@app/common/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { DeviceTypeEnum } from '@Constant/enums';

export class GetDeviceDto extends PageOptionsDto {
  @ApiProperty({ required: false })
  @IsOptional()
  status: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  deviceType: DeviceTypeEnum;

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

  @ApiProperty({ required: true })
  @IsNotEmpty()
  sensorName: string;

  @ApiProperty({ required: false })
  @IsOptional()
  systemType?: string;
}

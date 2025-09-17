import { IsOptional } from 'class-validator';
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

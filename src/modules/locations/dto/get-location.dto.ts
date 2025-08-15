import { PageOptionsDto } from '@app/common/dtos';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

export class GetLocationDto extends PageOptionsDto {
  @ApiProperty({ description: 'Tên địa điểm', required: false })
  @IsOptional()
  search: string;

  @ApiProperty({ description: 'Loại hình thức', required: false })
  @IsOptional()
  locationTypeId: string;
}

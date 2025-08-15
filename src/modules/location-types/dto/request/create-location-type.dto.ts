import { IsString, IsOptional, IsBoolean, MaxLength, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LocationTypeEnum } from '@Constant/enums';

export class CreateLocationTypeDto {
  @ApiProperty({ description: 'Tên loại hình thức', maxLength: 255 })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: 'Mô tả loại hình thức' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Loại hình thức có phải là bậc giá', default: false })
  @IsBoolean()
  isTariffTier: boolean;

  @ApiProperty({ description: 'Loại hình thức', default: LocationTypeEnum.BUSINESS })
  @IsEnum(LocationTypeEnum)
  locationTypeEnum: LocationTypeEnum;
}

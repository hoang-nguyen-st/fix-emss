import { LocationTypeEnum } from '@Constant/enums';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class LocationTypeResponseDto {
  @ApiProperty({ description: 'Location type ID' })
  id: string;

  @ApiProperty({ description: 'Location type name' })
  name: string;

  @ApiPropertyOptional({ description: 'Location type description' })
  description?: string;

  @ApiProperty({ description: 'Is location type active' })
  isTariffTier: boolean;

  @ApiProperty({ description: 'Location type enum' })
  locationTypeEnum: LocationTypeEnum;

  @ApiProperty({ description: 'Created at' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt: Date;
}

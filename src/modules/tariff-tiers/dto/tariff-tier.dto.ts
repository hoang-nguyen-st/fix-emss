import { LocationTypeDto } from '@app/modules/location-types/dto/location-types.dto';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID, ValidateNested } from 'class-validator';

export class TariffTierDto {
  @Expose()
  id: string;
  @Expose()
  name: string;

  @Expose()
  kwh: number;

  @Expose()
  unitPrice: number;

  @Expose()
  level: number;

  @Expose()
  locationType: LocationTypeDto;
}

export class CreateTariffTierDto {
  @ApiProperty({
    example: 50,
    description: 'Số kWh áp dụng cho bậc này (có thể bỏ trống, hệ thống sẽ dùng giá trị mặc định theo level).',
    required: false,
  })
  @IsNumber()
  @IsOptional()
  kwh?: number;

  @ApiProperty({
    example: 1984,
    description: 'Đơn giá (VNĐ/kWh) của bậc này.',
  })
  @IsNumber()
  unitPrice: number;

  @ApiProperty({
    example: 1,
    description: 'Level của bậc giá (1 đến 6).',
  })
  @IsNumber()
  level: number;
}

export class CreateManyTariffTiersDto {
  @ApiProperty({
    example: 'a3f2b2b1-1234-4c67-9f2a-8a8b9c123abc',
    description: 'ID của workspace (UUID).',
  })
  @IsUUID()
  workspaceId: string;

  @ApiProperty({
    example: 'b6c5d4e3-5678-4f90-8a2b-7c8d9e456def',
    description: 'ID của loại địa điểm (UUID).',
  })
  @IsUUID()
  locationTypeId: string;

  @ApiProperty({
    type: [CreateTariffTierDto],
    description: 'Danh sách các bậc giá lũy tiến.',
    example: [
      { unitPrice: 1984, level: 1, kwh: 50 },
      { unitPrice: 2050, level: 2, kwh: 50 },
      { unitPrice: 2380, level: 3, kwh: 100 },
    ],
  })
  @ValidateNested({ each: true })
  @Type(() => CreateTariffTierDto)
  tiers: CreateTariffTierDto[];
}

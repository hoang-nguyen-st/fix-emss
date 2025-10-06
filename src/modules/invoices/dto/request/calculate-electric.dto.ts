import { IsNotEmpty, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateElectricDto {
  @ApiProperty({
    description: 'ID của địa điểm cần tính toán hóa đơn điện',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  @IsUUID()
  @IsNotEmpty()
  locationId: string;
}

export class TariffResult {
  @ApiProperty({
    description: 'Bậc thang điện (1, 2, 3, ...)',
    example: 1,
    minimum: 1,
  })
  tierLevel: number;

  @ApiProperty({
    description: 'Số kWh tiêu thụ trong bậc thang này',
    example: 50,
    minimum: 0,
  })
  kwh: number;

  @ApiProperty({
    description: 'Đơn giá điện cho bậc thang này (VNĐ/kWh)',
    example: 1609,
    minimum: 0,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Thành tiền cho bậc thang này (VNĐ)',
    example: 80450,
    minimum: 0,
  })
  amount: number;
}

export class BusinessResult {
  @ApiProperty({
    description: 'ID của thiết bị đo điện',
    example: '123e4567-e89b-12d3-a456-426614174000',
    format: 'uuid',
  })
  id: string;

  @ApiProperty({
    description: 'Tên thiết bị đo điện',
    example: 'DN_3P-Energy-Meter',
  })
  name: string;

  @ApiProperty({
    description: 'Lượng điện tiêu thụ của thiết bị (kWh)',
    example: 100,
    minimum: 0,
  })
  consumption: number;

  @ApiProperty({
    description: 'Đơn giá điện theo mức điện áp (VNĐ/kWh)',
    example: 1987,
    minimum: 0,
  })
  unitPrice: number;

  @ApiProperty({
    description: 'Thành tiền cho thiết bị này (VNĐ)',
    example: 198700,
    minimum: 0,
  })
  amount: number;

  @ApiProperty({
    description: 'Giá trị điện áp của thiết bị (kV)',
    example: 5,
    minimum: 0,
    required: false,
  })
  voltageValue?: number;

  @ApiProperty({
    description: 'Tên mức điện áp tương ứng với voltageValue',
    example: 'Dưới 6 kV',
    required: false,
  })
  voltageLevel?: string;
}

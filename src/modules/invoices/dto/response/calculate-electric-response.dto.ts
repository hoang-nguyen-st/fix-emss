import { ApiProperty } from '@nestjs/swagger';
import { TariffResult, BusinessResult } from '../request/calculate-electric.dto';

export class ResidentialCalculationResponseDto {
  @ApiProperty({
    description: 'Tổng lượng điện tiêu thụ (kWh)',
    example: 150,
    minimum: 0,
  })
  consumption: number;

  @ApiProperty({
    description: 'Tổng tiền điện chưa bao gồm VAT (VNĐ)',
    example: 241350,
    minimum: 0,
  })
  total: number;

  @ApiProperty({
    description: 'Tổng tiền điện đã bao gồm VAT 8% (VNĐ)',
    example: 260658,
    minimum: 0,
  })
  totalWithVAT: number;

  @ApiProperty({
    description: 'Chi tiết tính toán theo từng bậc thang điện',
    type: [TariffResult],
    example: [
      {
        tierLevel: 1,
        kwh: 50,
        unitPrice: 1609,
        amount: 80450,
      },
      {
        tierLevel: 2,
        kwh: 50,
        unitPrice: 1734,
        amount: 86700,
      },
      {
        tierLevel: 3,
        kwh: 50,
        unitPrice: 2014,
        amount: 100700,
      },
    ],
  })
  details: TariffResult[];
}

export class BusinessCalculationResponseDto {
  @ApiProperty({
    description: 'Tổng lượng điện tiêu thụ của tất cả thiết bị (kWh)',
    example: 934,
    minimum: 0,
  })
  totalConsumption: number;

  @ApiProperty({
    description: 'Tổng tiền điện chưa bao gồm VAT (VNĐ)',
    example: 1502806,
    minimum: 0,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Tổng tiền điện đã bao gồm VAT 8% (VNĐ)',
    example: 1623030,
    minimum: 0,
  })
  totalPriceWithVAT: number;

  @ApiProperty({
    description: 'Chi tiết tính toán theo từng thiết bị và mức điện áp',
    type: [BusinessResult],
    example: [
      {
        id: '34f6e049-01db-415e-830e-0788b6c714fe',
        name: 'DN_3P-Energy-Meter',
        consumption: 10,
        unitPrice: 1609,
        amount: 16090,
        voltageValue: 5,
        voltageLevel: 'Dưới 6 kV',
      },
      {
        id: '57b952d8-a37e-4098-8f4a-6346d9ed134a',
        name: 'Even_Smart meter MK7MI',
        consumption: 924,
        unitPrice: 1609,
        amount: 1486716,
        voltageValue: 5,
        voltageLevel: 'Dưới 6 kV',
      },
    ],
  })
  details: BusinessResult[];
}

export class ProductionCalculationResponseDto {
  @ApiProperty({
    description: 'Tổng lượng điện tiêu thụ của tất cả thiết bị (kWh)',
    example: 1200,
    minimum: 0,
  })
  totalConsumption: number;

  @ApiProperty({
    description: 'Tổng tiền điện chưa bao gồm VAT (VNĐ)',
    example: 2384400,
    minimum: 0,
  })
  totalPrice: number;

  @ApiProperty({
    description: 'Tổng tiền điện đã bao gồm VAT 8% (VNĐ)',
    example: 2575152,
    minimum: 0,
  })
  totalPriceWithVAT: number;

  @ApiProperty({
    description: 'Chi tiết tính toán theo từng thiết bị và mức điện áp',
    type: [BusinessResult],
    example: [
      {
        id: '34f6e049-01db-415e-830e-0788b6c714fe',
        name: 'Production_Meter_1',
        consumption: 500,
        unitPrice: 1987,
        amount: 993500,
        voltageValue: 10,
        voltageLevel: 'Từ 6 kV đến dưới 22 kV',
      },
      {
        id: '57b952d8-a37e-4098-8f4a-6346d9ed134a',
        name: 'Production_Meter_2',
        consumption: 700,
        unitPrice: 1833,
        amount: 1283100,
        voltageValue: 109,
        voltageLevel: 'Từ 22 kV đến dưới 110 kV',
      },
    ],
  })
  details: BusinessResult[];
}

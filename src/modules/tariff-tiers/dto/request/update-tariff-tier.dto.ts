import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class UpdateTariffTierPriceDto {
  @ApiProperty({ example: 3300, description: 'Đơn giá mới cho bậc lũy tiến' })
  @IsNumber()
  unitPrice: number;
}

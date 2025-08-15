import { PartialType } from '@nestjs/mapped-types';
import { CreatePricingElectricRuleDto } from './create-pricing-electric-rule.dto';
import { TimeUsageTypeEnum } from '@Constant/enums';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UpdatePricingElectricRuleDto extends PartialType(CreatePricingElectricRuleDto) {}

export class UpdatePriceByVoltAndPricingListDto {
  @ApiPropertyOptional({
    enum: TimeUsageTypeEnum,
    description: 'Loại thời gian sử dụng (giờ bình thường, cao điểm, thấp điểm)',
  })
  @IsOptional()
  @IsEnum(TimeUsageTypeEnum)
  timeUsage?: TimeUsageTypeEnum;

  @ApiProperty({
    example: 1500,
    description: 'Đơn giá mới cho từng mức điện áp trong danh sách giá',
  })
  @IsNumber()
  unitPrice: number;
}

export class UpdateTariffTierPriceDto {
  @ApiProperty({ example: 1500, description: 'Đơn giá mới cho Tariff Tier' })
  @IsNumber()
  unitPrice: number;
}

import { TimeUsageTypeEnum } from '@Constant/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsEnum,
  IsPositive,
  IsArray,
  ValidateNested,
  ArrayNotEmpty,
} from 'class-validator';

export class CreatePricingElectricRuleDto {
  @IsString()
  name: string;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  locationTypeVoltageLevelId: string;
}

export class PricingRuleVoltageDto {
  @IsUUID()
  voltageLevelId: string;

  @IsEnum(TimeUsageTypeEnum)
  timeUsageEnum: TimeUsageTypeEnum;

  @IsNumber()
  @IsPositive()
  unitPrice: number;
}

export class PricingRuleDetailDto {
  @IsUUID()
  priceTypeId: string;

  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PricingRuleVoltageDto)
  voltageRules: PricingRuleVoltageDto[];
}

export class BulkCreatePricingElectricRulesDto {
  @ApiProperty({
    description: 'ID của workspace',
    example: '12345678-90ab-cdef-1234-567890abcdef',
  })
  @IsUUID()
  workspaceId: string;

  @ApiProperty({
    description: 'ID của location type',
    example: '23456789-01bc-def1-2345-67890abcdef1',
  })
  @IsUUID()
  locationTypeId: string;

  @ApiProperty({
    description: 'Danh sách quy tắc giá điện theo price type',
    type: [PricingRuleDetailDto],
    example: [
      {
        priceTypeId: 'b2c3d4e5-f6g7-8901-bcde-f23456789012',
        voltageRules: [
          {
            voltageLevelId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            timeUsageEnum: 'PEAK',
            unitPrice: 1850,
          },
          {
            voltageLevelId: 'c4d5e6f7-g8h9-0123-cdef-456789012345',
            timeUsageEnum: 'OFF_PEAK',
            unitPrice: 1200,
          },
        ],
      },
      {
        priceTypeId: 'd4e5f6g7-h8i9-0123-defg-456789012345',
        voltageRules: [
          {
            voltageLevelId: 'a1b2c3d4-e5f6-7890-abcd-ef1234567890',
            timeUsageEnum: 'NORMAL',
            unitPrice: 1550,
          },
        ],
      },
    ],
  })
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => PricingRuleDetailDto)
  pricingRules: PricingRuleDetailDto[];
}

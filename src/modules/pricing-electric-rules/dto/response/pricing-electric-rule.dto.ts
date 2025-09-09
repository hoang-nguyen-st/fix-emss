import { MeterTypeEnum, PriceTypeEnum, TariffTierEnum, TimeUsageTypeEnum } from '@Constant/enums';
import { Exclude, Expose, Type } from 'class-transformer';

export class PricingElectricRuleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  unitPrice: number;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => Object)
  locationTypeVoltageLevel: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}

export class MeterTypePricing {
  id: string;
  name: string;
  meterTypeEnum: MeterTypeEnum;
  rulesByVoltageLevel: VoltageLevelRules[];
}

export class PricingRule {
  id: string;
  unitPrice: number;
  timeUsageEnum: TimeUsageTypeEnum;
}

export class VoltageLevel {
  id: string;
  name: string;
  fromVoltage: number;
  toVoltage: number;
}

export class VoltageLevelRules {
  voltageLevel: VoltageLevel;
  rules: PricingRule[];
}

export class VoltageTemplateLevelDto {
  id: string;
  name: string;
  fromVoltage: number;
  toVoltage: number;
}

export class PricingRuleTemplateDto {
  id: string | null;
  unitPrice: string;
  timeUsageEnum: TimeUsageTypeEnum;
}

export class RulesByVoltageLevelTemplateDto {
  voltageLevel: VoltageTemplateLevelDto;
  rules: PricingRuleTemplateDto[];
}

export class PriceTypeTemplateDto {
  id: string;
  name: string;
  priceTypeEnum: PriceTypeEnum;
  rulesByVoltageLevel: RulesByVoltageLevelTemplateDto[];
}

export class TariffTierTemplateDto {
  id: string;
  name: string;
  kwh: number;
  unitPrice: string;
  level: number;
  tariffTierEnum: TariffTierEnum;
  locationTypeId: string;
}

export type PricingTemplateResponseData = PriceTypeTemplateDto[] | TariffTierTemplateDto[];

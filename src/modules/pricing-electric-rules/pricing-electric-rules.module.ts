import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { PricingElectricRuleEntity } from './entities/pricing-electric-rule.entity';
import { LocationTypeVoltageLevelEntity } from '../location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PricingElectricRulesController } from './pricing-electric-rules.controller';
import { PricingElectricRulesService } from './pricing-electric-rules.service';
import { LocationTypeEntity } from '../location-types/entities';
import { TariffTierEntity } from '../tariff-tiers/entities';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PricingElectricRuleEntity,
      LocationTypeVoltageLevelEntity,
      LocationTypeEntity,
      TariffTierEntity,
    ]),
  ],
  exports: [TypeOrmModule, PricingElectricRulesService],
  controllers: [PricingElectricRulesController],
  providers: [PricingElectricRulesService],
})
export class PricingElectricRulesModule {}

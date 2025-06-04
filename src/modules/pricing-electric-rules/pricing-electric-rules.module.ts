import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PricingElectricRulesController } from './pricing-electric-rules.controller';
import { PricingElectricRuleEntity } from './entities/pricing-electric-rule.entity';
import { MeterTypesModule } from '../meter-types/meter-types.module';
import { VoltageLevelsModule } from '../voltage-levels/voltage-levels.module';
import { ZonesModule } from '../zones/zones.module';
import { PricingElectricRulesService } from './pricing-electric-rules.service';

@Module({
  imports: [TypeOrmModule.forFeature([PricingElectricRuleEntity]), MeterTypesModule, VoltageLevelsModule, ZonesModule],
  controllers: [PricingElectricRulesController],
  providers: [PricingElectricRulesService],
  exports: [PricingElectricRulesService],
})
export class PricingElectricRulesModule {}

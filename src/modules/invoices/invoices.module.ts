import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities';
import { TariffTierEntity } from '@Entity/index';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { InvoicesController } from './invoices.controller';
import { InvoiceStrategyFactory } from './strategies/invoice-strategy.factory';
import { ResidentialStrategy } from './strategies/residential.strategy';
import { BusinessStrategy } from './strategies/business.strategy';
import { ProductionStrategy } from './strategies/production.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      InvoiceEntity,
      LocationDeviceEntity,
      TariffTierEntity,
      LocationEntity,
      DeviceEntity,
      VoltageLevelEntity,
      LocationTypeVoltageLevelEntity,
      PricingElectricRuleEntity,
    ]),
  ],
  exports: [TypeOrmModule, InvoicesService],
  providers: [InvoicesService, InvoiceStrategyFactory, ResidentialStrategy, BusinessStrategy, ProductionStrategy],
  controllers: [InvoicesController],
})
export class InvoicesModule {}

import { TypeOrmModule } from '@nestjs/typeorm';
import 'dotenv/config';
import { seeder } from 'nestjs-seeder';

import { UserEntity } from '@UsersModule/entities';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { PriceTypeEntity, PriceTypeLocationTypeEntity, TimeSlotEntity } from '@app/modules/price-types/entities';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities/tariff-tier.entity';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { InvoiceEntity, InvoiceDetailEntity } from '@app/modules/invoices/entities';
import { DatabaseModule } from './config/database.module';
import {
  UserSeeder,
  LocationTypeSeeder,
  VoltageLevelsSeeder,
  TimeSlotsSeeder,
  TariffTiersSeeder,
  PriceTypeSeeder,
  LocationTypeVoltageLevelSeeder,
  PriceTypeLocationTypeSeeder,
  PricingElectricRuleSeeder,
} from './database/seeds';

seeder({
  imports: [
    DatabaseModule,
    TypeOrmModule.forFeature([
      UserEntity,
      WorkspaceEntity,
      LocationTypeEntity,
      VoltageLevelEntity,
      TimeSlotEntity,
      TariffTierEntity,
      PriceTypeEntity,
      PriceTypeLocationTypeEntity,
      LocationTypeVoltageLevelEntity,
      PricingElectricRuleEntity,
      LocationEntity,
      DeviceEntity,
      InvoiceEntity,
      InvoiceDetailEntity,
    ]),
  ],
}).run([
  UserSeeder,
  LocationTypeSeeder,
  VoltageLevelsSeeder,
  TimeSlotsSeeder,
  TariffTiersSeeder,
  PriceTypeSeeder,
  LocationTypeVoltageLevelSeeder,
  PriceTypeLocationTypeSeeder,
  PricingElectricRuleSeeder,
]);

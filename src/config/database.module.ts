import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserEntity } from '@app/modules/users/entities/user.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { WorkspaceUserEntity } from '@app/modules/workspace-user/entities/workspace-user.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { PriceTypeEntity } from '@app/modules/price-types/entities/price-type.entity';
import { TimeSlotEntity } from '@app/modules/price-types/entities/time-slot.entity';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities/tariff-tier.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { InvoiceItemEntity } from '@app/modules/invoices/entities/invoice-item.entity';
import { PriceTypeLocationTypeEntity } from '@app/modules/price-types/entities/price-type-location-type.entity';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_POSTGRES_HOST'),
        port: configService.get('DB_POSTGRES_PORT'),
        username: configService.get('DB_POSTGRES_USERNAME'),
        password: configService.get('DB_POSTGRES_PASSWORD'),
        database: configService.get('DB_POSTGRES_DATABASE'),
        synchronize: configService.get('DB_POSTGRES_SYNCHRONIZE'),
        logging: configService.get('DB_POSTGRES_LOGGING'),
        entities: [
          UserEntity,
          WorkspaceEntity,
          WorkspaceUserEntity,
          LocationTypeEntity,
          LocationEntity,
          DeviceEntity,
          PriceTypeEntity,
          TimeSlotEntity,
          VoltageLevelEntity,
          LocationTypeVoltageLevelEntity,
          PricingElectricRuleEntity,
          TariffTierEntity,
          InvoiceEntity,
          InvoiceItemEntity,
          PriceTypeLocationTypeEntity,
          LocationDeviceEntity,
        ],
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}

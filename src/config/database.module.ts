import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { MeterTypeEntity } from '@app/modules/meter-types/entities/meter-type.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { ProjectEntity } from '@app/modules/projects/entities/project.entity';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { ZoneResourceEntity } from '@app/modules/zones/entities/zone-resource.entity';
import { ZoneEntity } from '@app/modules/zones/entities/zone.entity';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TimeSlotsEntity } from '@app/modules/meter-types/entities/time-slots.entity';
import { UserEntity } from '@UsersModule/entities';
import { ProjectUserEntity } from '@app/modules/project-users/entities/project-users.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_POSTGRE_HOST'),
        port: configService.get<number>('DB_POSTGRE_PORT'),
        database: configService.get<string>('DB_POSTGRE_DATABASE'),
        username: configService.get<string>('DB_POSTGRE_USERNAME'),
        password: configService.get<string>('DB_POSTGRE_PASSWORD'),
        synchronize: configService.get<boolean>('DB_POSTGRE_SYNCHRONIZE'),
        logging: configService.get<boolean>('DB_POSTGRE_LOGGING'),
        entities: [
          UserEntity,
          ProjectEntity,
          ProjectUserEntity,
          ZoneEntity,
          ZoneResourceEntity,
          MeterTypeEntity,
          PricingElectricRuleEntity,
          VoltageLevelEntity,
          InvoiceEntity,
          TimeSlotsEntity,
        ],
      }),
    }),
  ],
})
export class DatabaseModule {}

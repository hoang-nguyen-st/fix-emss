import { ClassSerializerInterceptor, MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_INTERCEPTOR } from '@nestjs/core';

import { UsersModule } from '@UsersModule/users.module';
import { DatabaseModule } from '@app/config/database.module';
import { ScheduleModule } from '@nestjs/schedule';
import { XMLMiddleware } from './common/middleware/xml.middleware';
import { AuthModule } from './modules/auth/auth.module';
import { DataCrawlerModule } from './modules/data-crawler/data-crawler.module';
import * as Joi from 'joi';
import { WorkspacesModule } from './modules/workspaces/workspaces.module';
import { LocationTypesModule } from './modules/location-types/location-types.module';
import { LocationsModule } from './modules/locations/locations.module';
import { DevicesModule } from './modules/devices/devices.module';
import { PriceTypesModule } from './modules/price-types/price-types.module';
import { VoltageLevelsModule } from './modules/voltage-levels/voltage-levels.module';
import { LocationTypeVoltageLevelsModule } from './modules/location-type-voltage-levels/location-type-voltage-levels.module';
import { PricingElectricRulesModule } from './modules/pricing-electric-rules/pricing-electric-rules.module';
import { TariffTiersModule } from './modules/tariff-tiers/tariff-tiers.module';
import { InvoicesModule } from './modules/invoices/invoices.module';
import { WorkspaceUserModule } from './modules/workspace-user/workspace-user.module';
import { LocationDeviceModule } from './modules/location-devices/location-device.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      validationSchema: Joi.object({
        APP_PORT: Joi.number().required(),
        DB_POSTGRES_HOST: Joi.string().required(),
        DB_POSTGRES_PORT: Joi.number().required(),
        DB_POSTGRES_USERNAME: Joi.string().required(),
        DB_POSTGRES_PASSWORD: Joi.string().required(),
        DB_POSTGRES_DATABASE: Joi.string().required(),
        DB_POSTGRES_SYNCHRONIZE: Joi.boolean().required(),
        DB_POSTGRES_LOGGING: Joi.boolean().required(),
        JWT_ACCESS_SECRETKEY: Joi.string().required(),
        JWT_ACCESS_EXPIRES: Joi.string().required(),
        JWT_REFRESH_SECRETKEY: Joi.string().required(),
        JWT_REFRESH_EXPIRES: Joi.string().required(),
        DATA_CRAWLER_API_ENDPOINT: Joi.string().required(),
        JWT_ACCESS_TOKEN_AMIGO: Joi.string().required(),
        PROJECT_CRON_TIME: Joi.string().required(),
        ACCOUNT_CRON_TIME: Joi.string().required(),
        DEVICE_CRON_TIME: Joi.string().required(),
        GEMINI_API_KEY: Joi.string().required(),
        GEMINI_VERSION: Joi.string().required(),
        AUTH_USERNAME: Joi.string().required(),
        AUTH_PASSWORD: Joi.string().required(),
        AUTH_TENANT_CODE: Joi.string().required(),
        AUTH_CLIENT_ID: Joi.string().required(),
        AUTH_CLIENT_SECRET: Joi.string().required(),
        AUTH_TYPE: Joi.string().required(),
        AUTH_GRANT_TYPE: Joi.string().required(),
        CAPTCHA_KEY: Joi.string().required(),
      }),
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    WorkspacesModule,
    WorkspaceUserModule,
    LocationTypesModule,
    LocationsModule,
    DevicesModule,
    PriceTypesModule,
    VoltageLevelsModule,
    LocationTypeVoltageLevelsModule,
    PricingElectricRulesModule,
    TariffTiersModule,
    InvoicesModule,
    LocationDeviceModule,
    DataCrawlerModule,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: ClassSerializerInterceptor,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(XMLMiddleware).forRoutes({
      path: 'report-1/import',
      method: RequestMethod.POST,
    });
  }
}

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { TariffTierEntity } from './entities/tariff-tier.entity';
import { TariffTiersController } from './tariff-tiers.controller';
import { TariffTiersService } from './tariff-tiers.service';

@Module({
  imports: [TypeOrmModule.forFeature([TariffTierEntity])],
  exports: [TypeOrmModule],
  controllers: [TariffTiersController],
  providers: [TariffTiersService],
})
export class TariffTiersModule {}

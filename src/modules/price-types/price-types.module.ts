import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PriceTypesController } from './price-types.controller';
import { PriceTypesService } from './price-types.service';
import { PriceTypeEntity, PriceTypeLocationTypeEntity } from './entities';

@Module({
  imports: [TypeOrmModule.forFeature([PriceTypeEntity, PriceTypeLocationTypeEntity])],
  controllers: [PriceTypesController],
  providers: [PriceTypesService],
  exports: [PriceTypesService],
})
export class PriceTypesModule {}

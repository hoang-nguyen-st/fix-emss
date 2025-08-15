import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LocationTypesController } from './location-types.controller';
import { LocationTypesService } from './location-types.service';
import { PriceTypeLocationTypeEntity } from '@app/modules/price-types/entities/price-type-location-type.entity';
import { LocationTypeEntity } from './entities/location-type.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationTypeEntity, PriceTypeLocationTypeEntity])],
  controllers: [LocationTypesController],
  providers: [LocationTypesService],
  exports: [LocationTypesService],
})
export class LocationTypesModule {}

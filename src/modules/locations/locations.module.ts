import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocationEntity } from './entities/location.entity';
import { LocationsController } from './location.controller';
import { LocationsService } from './locations.service';
import { LocationTypesModule } from '../location-types/location-types.module';
import { PriceTypesModule } from '../price-types/price-types.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([LocationEntity]), LocationTypesModule, PriceTypesModule, UsersModule],
  controllers: [LocationsController],
  providers: [LocationsService],
  exports: [LocationsService],
})
export class LocationsModule {}

import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { LocationTypeVoltageLevelEntity } from './entities/location-type-voltage-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LocationTypeVoltageLevelEntity])],
  exports: [TypeOrmModule],
})
export class LocationTypeVoltageLevelsModule {}

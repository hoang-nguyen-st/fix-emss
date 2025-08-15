import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { VoltageLevelEntity } from './entities/voltage-level.entity';

@Module({
  imports: [TypeOrmModule.forFeature([VoltageLevelEntity])],
  exports: [TypeOrmModule],
})
export class VoltageLevelsModule {}

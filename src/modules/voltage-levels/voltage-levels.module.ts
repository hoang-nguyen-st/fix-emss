import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoltageLevelEntity } from './entities/voltage-level.entity';
import { VoltageLevelsController } from './voltage-levels.controller';
import { VoltageLevelsService } from './voltage-levels.service';

@Module({
  imports: [TypeOrmModule.forFeature([VoltageLevelEntity])],
  controllers: [VoltageLevelsController],
  providers: [VoltageLevelsService],
  exports: [VoltageLevelsService],
})
export class VoltageLevelsModule {}

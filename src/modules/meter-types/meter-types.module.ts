import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MeterTypeEntity } from './entities/meter-type.entity';
import { MeterTypesController } from './meter-types.controller';
import { MeterTypesService } from './meter-types.service';

@Module({
  imports: [TypeOrmModule.forFeature([MeterTypeEntity])],
  controllers: [MeterTypesController],
  providers: [MeterTypesService],
  exports: [MeterTypesService],
})
export class MeterTypesModule {}

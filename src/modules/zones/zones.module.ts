import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZoneEntity } from './entities/zone.entity';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { ZoneResourceEntity } from './entities/zone-resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZoneEntity, ZoneResourceEntity])],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZonesModule {}

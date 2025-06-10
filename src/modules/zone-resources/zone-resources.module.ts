import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZoneResourcesService } from './zone-resources.service';
import { ZoneResourcesController } from './zone-resources.controller';
import { ZonesModule } from '../zones/zones.module';
import { ZoneResourceEntity } from './entities/zone-resource.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ZoneResourceEntity]), ZonesModule],
  controllers: [ZoneResourcesController],
  providers: [ZoneResourcesService],
  exports: [ZoneResourcesService],
})
export class ZoneResourcesModule {}

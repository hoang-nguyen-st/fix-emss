import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ZonesService } from './zones.service';
import { ZonesController } from './zones.controller';
import { ZoneEntity } from './entities/zone.entity';
import { ProjectsModule } from '../projects/projects.module';

@Module({
  imports: [TypeOrmModule.forFeature([ZoneEntity]), ProjectsModule],
  controllers: [ZonesController],
  providers: [ZonesService],
  exports: [ZonesService],
})
export class ZonesModule {}

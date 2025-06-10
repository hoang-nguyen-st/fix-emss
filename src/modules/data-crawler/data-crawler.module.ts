import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataCrawlerService } from './data-crawler.service';
import { HttpModule } from '@nestjs/axios';
import { DataCrawlerController } from './data-crawler.controller';
import { ConfigService } from '@nestjs/config';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectUsersModule } from '../project-users/project-users.module';
import { UsersModule } from '@UsersModule/users.module';
import { ZonesModule } from '../zones/zones.module';
import { ZoneResourcesModule } from '../zone-resources/zone-resources.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    TypeOrmModule.forFeature([]),
    ProjectsModule,
    ProjectUsersModule,
    UsersModule,
    ZonesModule,
    ZoneResourcesModule,
  ],
  controllers: [DataCrawlerController],
  providers: [DataCrawlerService, ConfigService],
  exports: [DataCrawlerService],
})
export class DataCrawlerModule {}

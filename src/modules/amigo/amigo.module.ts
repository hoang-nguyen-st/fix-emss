import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AmigoService } from './amigo.service';
import { AmigoController } from './amigo.controller';
import { DataCrawlerModule } from '@app/modules/data-crawler/data-crawler.module';

@Module({
  imports: [HttpModule, DataCrawlerModule],
  controllers: [AmigoController],
  providers: [AmigoService],
  exports: [AmigoService],
})
export class AmigoModule {}

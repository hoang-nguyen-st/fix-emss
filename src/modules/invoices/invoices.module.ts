import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InvoiceEntity } from './entities/invoice.entity';
import { InvoicesService } from './invoices.service';
import { LocationDeviceEntity } from '../location-devices/entities';
import { TariffTierEntity } from '@Entity/index';
import { InvoicesController } from './invoices.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity, LocationDeviceEntity, TariffTierEntity])],
  exports: [TypeOrmModule, InvoicesService],
  providers: [InvoicesService],
  controllers: [InvoicesController],
})
export class InvoicesModule {}

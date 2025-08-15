import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { InvoiceEntity } from './entities/invoice.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity])],
  exports: [TypeOrmModule],
})
export class InvoicesModule {}

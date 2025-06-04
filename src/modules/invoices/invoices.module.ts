import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvoicesController } from './invoices.controller';
import { InvoicesService } from './invoices.service';
import { InvoiceEntity } from './entities/invoice.entity';
import { UsersModule } from '../users/users.module';
import { PricingElectricRulesModule } from '../pricing-electric-rules/pricing-electric-rules.module';

@Module({
  imports: [TypeOrmModule.forFeature([InvoiceEntity]), UsersModule, PricingElectricRulesModule],
  controllers: [InvoicesController],
  providers: [InvoicesService],
  exports: [InvoicesService],
})
export class InvoicesModule {}

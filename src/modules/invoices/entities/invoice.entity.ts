import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities/tariff-tier.entity';
import { InvoiceDetailEntity } from '@app/modules/invoices/entities/invoice-detail.entity';
import { InvoiceStatusEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

@Entity('invoices')
export class InvoiceEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'date', name: 'effective_from' })
  effectiveFrom: Date;

  @Expose()
  @Column({ type: 'date', name: 'effective_to' })
  effectiveTo: Date;

  @Expose()
  @Column({ type: 'numeric', name: 'from_kwh' })
  fromKwh: number;

  @Expose()
  @Column({ type: 'numeric', name: 'to_kwh' })
  toKwh: number;

  @Expose()
  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Expose()
  @Column({ type: 'numeric', name: 'total_amount' })
  totalAmount: number;

  @Expose()
  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'vat_rate' })
  vatRate: number;

  @Expose()
  @Column({ type: 'numeric', name: 'vat_amount' })
  vatAmount: number;

  @Expose()
  @Column({ type: 'enum', enum: InvoiceStatusEnum, name: 'status' })
  status: InvoiceStatusEnum;

  @Expose()
  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Expose()
  @Column({ type: 'uuid', nullable: true, name: 'pricing_electric_rule_id' })
  pricingElectricRuleId: string;

  @Expose()
  @Column({ type: 'uuid', nullable: true, name: 'tariff_tier_id' })
  tariffTierId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'location_id' })
  locationId: string;

  @ManyToOne(() => PricingElectricRuleEntity)
  @JoinColumn({ name: 'pricing_electric_rule_id' })
  pricingElectricRule: PricingElectricRuleEntity;

  @ManyToOne(() => TariffTierEntity)
  @JoinColumn({ name: 'tariff_tier_id' })
  tariffTier: TariffTierEntity;

  @ManyToOne(() => LocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @OneToOne(() => InvoiceDetailEntity, (invoiceDetail) => invoiceDetail.invoice)
  invoiceDetail: InvoiceDetailEntity;
}

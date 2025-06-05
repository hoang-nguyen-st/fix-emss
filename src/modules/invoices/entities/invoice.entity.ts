import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { PricingElectricRuleEntity } from '../../pricing-electric-rules/entities/pricing-electric-rule.entity';
import { AbstractEntity } from '@Entity/abstract.entity';

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

@Entity('invoices')
export class InvoiceEntity extends AbstractEntity {
  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date' })
  effectiveTo: Date;

  @Column({ type: 'decimal' })
  fromKwh: number;

  @Column({ type: 'decimal' })
  toKwh: number;

  @Column({ type: 'date' })
  dueDate: Date;

  @Column({ type: 'decimal' })
  totalAmount: number;

  @Column({ type: 'decimal' })
  vatRate: number;

  @Column({ type: 'decimal' })
  vatAmount: number;

  @Column({ type: 'enum', enum: InvoiceStatus })
  status: InvoiceStatus;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PricingElectricRuleEntity)
  @JoinColumn({ name: 'pricing_electric_rule_id' })
  pricingElectricRule: PricingElectricRuleEntity;
}

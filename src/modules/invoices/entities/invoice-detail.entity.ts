import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { Expose } from 'class-transformer';

@Entity('invoice_detail')
export class InvoiceDetailEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'uuid', unique: true, name: 'invoice_id' })
  invoiceId: string;

  @OneToOne(() => InvoiceEntity)
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'initial_normal_hour' })
  initialNormalHour: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'initial_peak_hour' })
  initialPeakHour: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'initial_off_peak_hour' })
  initialOffPeakHour: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'current_normal_hour' })
  currentNormalHour: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'current_peak_hour' })
  currentPeakHour: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'current_off_peak_hour' })
  currentOffPeakHour: number;
}

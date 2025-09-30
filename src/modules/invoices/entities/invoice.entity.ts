import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { InvoiceItemEntity } from '@app/modules/invoices/entities/invoice-item.entity';
import { Expose } from 'class-transformer';
import { InvoiceStatusEnum, InvoiceTypeEnum } from '@Constant/enums';

@Entity('invoices')
export class InvoiceEntity extends AbstractEntity {
  @Expose()
  @Column({
    type: 'enum',
    enum: InvoiceTypeEnum,
    name: 'invoice_type',
    comment: 'Loại hóa đơn: HOUSEHOLD (bậc thang), BUSINESS/PRODUCTION (3 biểu giá)',
  })
  invoiceType: InvoiceTypeEnum;

  @Expose()
  @Column({ type: 'date', name: 'effective_from' })
  effectiveFrom: Date;

  @Expose()
  @Column({ type: 'date', name: 'effective_to' })
  effectiveTo: Date;

  @Expose()
  @Column({
    type: 'numeric',
    name: 'total_consumption',
    comment: 'Tổng điện năng tiêu thụ (kWh)',
  })
  totalConsumption: number;

  @Expose()
  @Column({
    type: 'numeric',
    name: 'subtotal',
    comment: 'Tổng tiền chưa VAT',
  })
  subtotal: number;

  @Expose()
  @Column({ type: 'decimal', precision: 5, scale: 2, name: 'vat_rate' })
  vatRate: number;

  @Expose()
  @Column({ type: 'numeric', name: 'vat_amount' })
  vatAmount: number;

  @Expose()
  @Column({
    type: 'numeric',
    name: 'total_amount',
    comment: 'Tổng tiền sau VAT',
  })
  totalAmount: number;

  @Expose()
  @Column({ type: 'date', name: 'due_date' })
  dueDate: Date;

  @Expose()
  @Column({ type: 'enum', enum: InvoiceStatusEnum, name: 'status' })
  status: InvoiceStatusEnum;

  @Expose()
  @Column({ type: 'text', nullable: true, name: 'notes' })
  notes: string;

  @Expose()
  @Column({ type: 'uuid', name: 'location_id' })
  locationId: string;

  @ManyToOne(() => LocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @OneToMany(() => InvoiceItemEntity, (item) => item.invoice, {
    cascade: true,
    eager: true,
  })
  items: InvoiceItemEntity[];
}

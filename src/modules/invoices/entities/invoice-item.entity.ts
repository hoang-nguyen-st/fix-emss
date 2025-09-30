import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities/tariff-tier.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { Expose } from 'class-transformer';
import { InvoiceItemTypeEnum, TimeUsageEnum } from '@Constant/enums';

@Entity('invoice_items')
export class InvoiceItemEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'uuid', name: 'invoice_id' })
  invoiceId: string;

  @ManyToOne(() => InvoiceEntity, (invoice) => invoice.items, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'invoice_id' })
  invoice: InvoiceEntity;

  @Expose()
  @Column({
    type: 'enum',
    enum: InvoiceItemTypeEnum,
    name: 'item_type',
    comment: 'TIER (bậc thang), TIME_SLOT (giờ), DEVICE (thiết bị)',
  })
  itemType: InvoiceItemTypeEnum;

  @Expose()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'item_name',
    comment: 'Tên hiển thị: "Bậc 1", "Giờ bình thường", "Thiết bị ABC"',
  })
  itemName: string;

  @Expose()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'sort_order',
    comment: 'Thứ tự hiển thị',
  })
  sortOrder: number;

  @Expose()
  @Column({
    type: 'integer',
    nullable: true,
    name: 'tier_level',
    comment: 'Bậc thang: 1, 2, 3, 4, 5, 6',
  })
  tierLevel: number;

  @Expose()
  @Column({ type: 'uuid', nullable: true, name: 'tariff_tier_id' })
  tariffTierId: string;

  @ManyToOne(() => TariffTierEntity, { nullable: true })
  @JoinColumn({ name: 'tariff_tier_id' })
  tariffTier: TariffTierEntity;

  @Expose()
  @Column({
    type: 'enum',
    enum: TimeUsageEnum,
    nullable: true,
    name: 'time_usage_enum',
    comment: 'NORMAL, PEAK, OFF_PEAK, MID_PEAK',
  })
  timeUsageEnum: TimeUsageEnum;

  @Expose()
  @Column({ type: 'uuid', nullable: true, name: 'pricing_rule_id' })
  pricingRuleId: string;

  @ManyToOne(() => PricingElectricRuleEntity, { nullable: true })
  @JoinColumn({ name: 'pricing_rule_id' })
  pricingRule: PricingElectricRuleEntity;

  @Expose()
  @Column({ type: 'uuid', nullable: true, name: 'device_id' })
  deviceId: string;

  @ManyToOne(() => DeviceEntity, { nullable: true })
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @Expose()
  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'device_name',
    comment: 'Tên thiết bị (snapshot)',
  })
  deviceName: string;

  @Expose()
  @Column({
    type: 'numeric',
    nullable: true,
    name: 'voltage_value',
    comment: 'Điện áp thiết bị',
  })
  voltageValue: number;

  @Expose()
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'voltage_level',
    comment: 'Cấp điện áp: "Dưới 6 kV", "Từ 6 kV đến dưới 22 kV"',
  })
  voltageLevel: string;

  @Expose()
  @Column({
    type: 'numeric',
    nullable: true,
    name: 'initial_index',
    comment: 'Chỉ số đầu kỳ',
  })
  initialIndex: number;

  @Expose()
  @Column({
    type: 'numeric',
    nullable: true,
    name: 'current_index',
    comment: 'Chỉ số cuối kỳ',
  })
  currentIndex: number;

  @Expose()
  @Column({
    type: 'numeric',
    name: 'consumption',
    comment: 'Điện năng tiêu thụ (kWh)',
  })
  consumption: number;

  @Expose()
  @Column({
    type: 'numeric',
    name: 'unit_price',
    comment: 'Đơn giá (VNĐ/kWh)',
  })
  unitPrice: number;

  @Expose()
  @Column({
    type: 'numeric',
    name: 'amount',
    comment: 'Thành tiền (consumption * unitPrice)',
  })
  amount: number;
}

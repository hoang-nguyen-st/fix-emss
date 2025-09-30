import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity, InvoiceItemEntity } from '@app/common/entities';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PriceTypeEntity } from '@app/modules/price-types/entities/price-type.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { TimeUsageTypeEnum } from '@app/common/constants/enums';
import { Expose } from 'class-transformer';

@Entity('pricing_electric_rules')
export class PricingElectricRuleEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'numeric', name: 'unit_price' })
  unitPrice: number;

  @Expose()
  @Column({ type: 'uuid', name: 'location_type_voltage_level_id' })
  locationTypeVoltageLevelId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'price_type_id' })
  priceTypeId: string;

  @Expose()
  @Column({ type: 'enum', enum: TimeUsageTypeEnum, name: 'time_usage_enum' })
  timeUsageEnum: TimeUsageTypeEnum;

  @Expose()
  @Column({ type: 'uuid', name: 'workspace_id', nullable: true })
  workspaceId: string;

  @ManyToOne(() => LocationTypeVoltageLevelEntity)
  @JoinColumn({ name: 'location_type_voltage_level_id' })
  locationTypeVoltageLevel: LocationTypeVoltageLevelEntity;

  @ManyToOne(() => PriceTypeEntity)
  @JoinColumn({ name: 'price_type_id' })
  priceType: PriceTypeEntity;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspace_id' })
  workspace: WorkspaceEntity;

  @OneToMany(() => InvoiceItemEntity, (invoiceItem) => invoiceItem.pricingRule)
  invoices: InvoiceEntity[];
}

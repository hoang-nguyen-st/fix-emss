import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { Expose } from 'class-transformer';
import { InvoiceItemEntity } from '@Entity/index';

@Entity('tariff_tiers')
export class TariffTierEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Expose()
  @Column({ type: 'numeric', name: 'kwh' })
  kwh: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'unit_price' })
  unitPrice: number;

  @Expose()
  @Column({ type: 'numeric', name: 'level' })
  level: number;

  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'tariff_tier_enum' })
  tariffTierEnum: string;

  @Expose()
  @Column({ type: 'uuid', name: 'location_type_id', nullable: true })
  locationTypeId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'workspace_id', nullable: true })
  workspaceId: string;

  @ManyToOne(() => LocationTypeEntity, (locationType) => locationType.tariffTiers)
  @JoinColumn({ name: 'location_type_id' })
  locationType: LocationTypeEntity;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspace_id' })
  workspace: WorkspaceEntity;

  @OneToMany(() => InvoiceItemEntity, (invoiceItem) => invoiceItem.tariffTier)
  invoices: InvoiceEntity[];
}

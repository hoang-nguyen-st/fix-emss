import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { UserEntity } from '@app/modules/users/entities/user.entity';
import { LocationStatusEnum } from '@app/common/constants/enums';
import { PriceTypeEntity } from '@app/modules/price-types/entities/price-type.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';
import { Expose } from 'class-transformer';

@Entity('locations')
export class LocationEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Expose()
  @Column({ type: 'enum', enum: LocationStatusEnum, default: LocationStatusEnum.ACTIVE, name: 'status' })
  status: LocationStatusEnum;

  @Expose()
  @Column({ type: 'timestamp', nullable: true, name: 'initial_date' })
  initialDate: Date;

  @Expose()
  @Column({ type: 'uuid', name: 'workspace_id' })
  workspaceId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'location_type_id' })
  locationTypeId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'price_type_id', nullable: true })
  priceTypeId: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, length: 255, name: 'description' })
  description: string;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspace_id' })
  workspace: WorkspaceEntity;

  @ManyToOne(() => LocationTypeEntity)
  @JoinColumn({ name: 'location_type_id' })
  locationType: LocationTypeEntity;

  @ManyToOne(() => UserEntity)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @ManyToOne(() => PriceTypeEntity)
  @JoinColumn({ name: 'price_type_id' })
  priceType: PriceTypeEntity;

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.location)
  invoices: InvoiceEntity[];
}

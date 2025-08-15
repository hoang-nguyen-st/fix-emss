import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { PriceTypeEntity } from './price-type.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { Expose } from 'class-transformer';

@Entity('price_type_location_types')
export class PriceTypeLocationTypeEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'uuid', name: 'location_type_id' })
  locationTypeId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'price_type_id' })
  priceTypeId: string;

  @ManyToOne(() => PriceTypeEntity, (priceType) => priceType.priceTypeLocationTypes)
  @JoinColumn({ name: 'price_type_id' })
  priceType: PriceTypeEntity;

  @ManyToOne(() => LocationTypeEntity, (locationType) => locationType.priceTypeLocationTypes)
  @JoinColumn({ name: 'location_type_id' })
  locationType: LocationTypeEntity;
}

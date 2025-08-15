import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities/tariff-tier.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PriceTypeLocationTypeEntity } from '@app/modules/price-types/entities/price-type-location-type.entity';
import { LocationTypeEnum } from '@app/common/constants/enums';
import { Expose } from 'class-transformer';

@Entity('location_types')
export class LocationTypeEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, length: 255, name: 'description' })
  description: string;

  @Expose()
  @Column({ type: 'boolean', default: false, name: 'is_tariff_tier' })
  isTariffTier: boolean;

  @Expose()
  @Column({ type: 'enum', enum: LocationTypeEnum, name: 'location_type_enum' })
  locationTypeEnum: LocationTypeEnum;

  @OneToMany(() => TariffTierEntity, (tariffTier) => tariffTier.locationType)
  tariffTiers: TariffTierEntity[];

  @OneToMany(() => LocationTypeVoltageLevelEntity, (locationTypeVoltageLevel) => locationTypeVoltageLevel.locationType)
  locationTypeVoltageLevels: LocationTypeVoltageLevelEntity[];

  @OneToMany(() => PriceTypeLocationTypeEntity, (priceTypeLocationType) => priceTypeLocationType.locationType)
  priceTypeLocationTypes: PriceTypeLocationTypeEntity[];
}

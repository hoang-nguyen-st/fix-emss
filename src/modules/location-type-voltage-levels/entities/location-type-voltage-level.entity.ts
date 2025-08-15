import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { Expose } from 'class-transformer';

@Entity('location_type_voltage_levels')
export class LocationTypeVoltageLevelEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'uuid', name: 'voltage_level_id' })
  voltageLevelId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'location_type_id' })
  locationTypeId: string;

  @ManyToOne(() => VoltageLevelEntity, (voltageLevel) => voltageLevel.locationTypeVoltageLevels)
  @JoinColumn({ name: 'voltage_level_id' })
  voltageLevel: VoltageLevelEntity;

  @ManyToOne(() => LocationTypeEntity, (locationType) => locationType.locationTypeVoltageLevels)
  @JoinColumn({ name: 'location_type_id' })
  locationType: LocationTypeEntity;

  @OneToMany(() => PricingElectricRuleEntity, (pricingElectricRule) => pricingElectricRule.locationTypeVoltageLevel)
  pricingElectricRules: PricingElectricRuleEntity[];
}

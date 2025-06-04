import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { MeterTypeEntity } from '../../meter-types/entities/meter-type.entity';
import { VoltageLevelEntity } from '../../voltage-levels/entities/voltage-level.entity';
import { ZoneResourceEntity } from '../../zones/entities/zone-resource.entity';
import { AbstractEntity } from '@Entity/abstract.entity';

@Entity('pricing_electric_rules')
export class PricingElectricRuleEntity extends AbstractEntity {
  @Column({ type: 'decimal' })
  unitPrice: number;

  @ManyToOne(() => MeterTypeEntity)
  @JoinColumn({ name: 'meter_type_id' })
  meterType: MeterTypeEntity;

  @ManyToOne(() => VoltageLevelEntity)
  @JoinColumn({ name: 'voltage_level_id' })
  voltageLevel: VoltageLevelEntity;

  @ManyToOne(() => ZoneResourceEntity)
  @JoinColumn({ name: 'zone_resource_id' })
  zoneResource: ZoneResourceEntity;
}

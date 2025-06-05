import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { TimeSlotsEntity } from './time-slots.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';

@Entity('meter_types')
export class MeterTypeEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @OneToMany(() => PricingElectricRuleEntity, (pricingElectricRule) => pricingElectricRule.meterType)
  pricingElectricRules: PricingElectricRuleEntity[];

  @OneToMany(() => TimeSlotsEntity, (timeSlots) => timeSlots.meterType)
  timeSlots: TimeSlotsEntity[];
}

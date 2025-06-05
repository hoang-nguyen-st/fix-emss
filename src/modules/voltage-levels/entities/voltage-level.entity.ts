import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';

@Entity('voltage_levels')
export class VoltageLevelEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'numeric' })
  fromVoltage: number;
  @Column({ type: 'numeric' })
  toVoltage: number;

  @OneToMany(() => PricingElectricRuleEntity, (pricingElectricRule) => pricingElectricRule.voltageLevel)
  pricingElectricRules: PricingElectricRuleEntity[];
}

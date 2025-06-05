import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { ZoneEntity } from './zone.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';

export enum ResourceType {
  ELECTRIC = 'electric',
  WATER = 'water',
  GAS = 'gas',
}

@Entity('zone_resources')
export class ZoneResourceEntity extends AbstractEntity {
  @Column({ type: 'enum', enum: ResourceType })
  resource: ResourceType;

  @Column({ type: 'varchar' })
  deviceId: string;

  @Column({ type: 'varchar' })
  deviceName: string;

  @ManyToOne(() => ZoneEntity, (zone) => zone.zoneResources)
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;

  @OneToMany(() => PricingElectricRuleEntity, (pricingElectricRule) => pricingElectricRule.zoneResource)
  pricingElectricRules: PricingElectricRuleEntity[];
}

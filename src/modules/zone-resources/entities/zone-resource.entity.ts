import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { ResourceType } from '@Constant/enums';
import { ZoneEntity } from '@app/modules/zones/entities/zone.entity';

@Entity('zone_resources')
export class ZoneResourceEntity extends AbstractEntity {
  @Column({ type: 'varchar', unique: true })
  devEUI: string;

  @Column({ type: 'varchar' })
  tenantCode: string;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: ResourceType })
  resource: ResourceType;

  @Column({ type: 'varchar' })
  sensorId: string;

  @Column({ type: 'varchar' })
  description: string;

  @Column({ type: 'int' })
  deviceBrand: number;

  @Column({ type: 'int' })
  systemType: number;

  @Column({ type: 'varchar' })
  dataType: string;

  @Column({ type: 'varchar' })
  brand: string;

  @Column({ type: 'varchar' })
  sensorModel: string;

  @Column({ type: 'varchar' })
  alias: string;

  @Column({ type: 'varchar' })
  equipmentName: string;

  @Column({ type: 'boolean' })
  iot: boolean;

  @Column({ type: 'varchar', nullable: true })
  fieldCalculate: string;

  @ManyToOne(() => ZoneEntity, (zone) => zone.zoneResources)
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;

  @OneToMany(() => PricingElectricRuleEntity, (pricingElectricRule) => pricingElectricRule.zoneResource)
  pricingElectricRules: PricingElectricRuleEntity[];
}

import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { MeterTypeEntity } from '../../meter-types/entities/meter-type.entity';
import { VoltageLevelEntity } from '../../voltage-levels/entities/voltage-level.entity';
import { ZoneResourceEntity } from '../../zone-resources/entities/zone-resource.entity';
import { AbstractEntity } from '@Entity/abstract.entity';
import { InvoiceEntity } from '@app/modules/invoices/entities/invoice.entity';

@Entity('pricing_electric_rules')
export class PricingElectricRuleEntity extends AbstractEntity {
  @Column({ type: 'decimal' })
  unitPrice: number;

  @ManyToOne(() => MeterTypeEntity, (meterType) => meterType.pricingElectricRules)
  meterType: MeterTypeEntity;

  @ManyToOne(() => VoltageLevelEntity, (voltageLevel) => voltageLevel.pricingElectricRules)
  voltageLevel: VoltageLevelEntity;

  @ManyToOne(() => ZoneResourceEntity, (zoneResource) => zoneResource.pricingElectricRules)
  zoneResource: ZoneResourceEntity;

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.pricingElectricRule)
  invoices: InvoiceEntity[];
}

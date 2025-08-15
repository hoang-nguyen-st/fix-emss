import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { PriceTypeEnum } from '@app/common/constants/enums';
import { PriceTypeLocationTypeEntity } from './price-type-location-type.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { Expose } from 'class-transformer';

@Entity('price_types')
export class PriceTypeEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Expose()
  @Column({ type: 'enum', enum: PriceTypeEnum, name: 'price_type_enum' })
  priceTypeEnum: PriceTypeEnum;

  @Expose()
  @Column({ type: 'varchar', nullable: true, name: 'description' })
  description: string;

  @OneToMany(() => PriceTypeLocationTypeEntity, (priceTypeLocationType) => priceTypeLocationType.priceType)
  priceTypeLocationTypes: PriceTypeLocationTypeEntity[];

  @OneToMany(() => PricingElectricRuleEntity, (pricingRule) => pricingRule.priceType)
  pricingElectricRules: PricingElectricRuleEntity[];
}

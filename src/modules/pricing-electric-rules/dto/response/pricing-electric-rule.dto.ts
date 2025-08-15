import { Exclude, Expose, Type } from 'class-transformer';

export class PricingElectricRuleDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  unitPrice: number;

  @Expose()
  description: string;

  @Expose()
  isActive: boolean;

  @Expose()
  @Type(() => Object)
  locationTypeVoltageLevel: any;

  @Expose()
  createdAt: Date;

  @Expose()
  updatedAt: Date;

  @Exclude()
  deletedAt: Date;
}

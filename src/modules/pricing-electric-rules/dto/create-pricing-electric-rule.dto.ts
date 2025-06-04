import { IsNotEmpty, IsNumber, IsUUID } from 'class-validator';

export class CreatePricingElectricRuleDto {
  @IsNotEmpty()
  @IsNumber()
  unitPrice: number;

  @IsNotEmpty()
  @IsUUID()
  meterTypeId: string;

  @IsNotEmpty()
  @IsUUID()
  voltageLevelId: string;

  @IsNotEmpty()
  @IsUUID()
  zoneResourceId: string;
}

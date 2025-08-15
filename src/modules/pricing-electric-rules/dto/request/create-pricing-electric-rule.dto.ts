import { IsString, IsNumber, IsOptional, IsBoolean, IsUUID } from 'class-validator';

export class CreatePricingElectricRuleDto {
  @IsString()
  name: string;

  @IsNumber()
  unitPrice: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsUUID()
  locationTypeVoltageLevelId: string;
}

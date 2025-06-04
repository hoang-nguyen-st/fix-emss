import { IsNotEmpty, IsNumber, IsUUID, IsDate, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInvoiceDto {
  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  effectiveFrom: Date;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  effectiveTo: Date;

  @IsNotEmpty()
  @IsNumber()
  fromKwh: number;

  @IsNotEmpty()
  @IsNumber()
  toKwh: number;

  @IsNotEmpty()
  @Type(() => Date)
  @IsDate()
  dueDate: Date;

  @IsNotEmpty()
  @IsNumber()
  totalAmount: number;

  @IsNotEmpty()
  @IsNumber()
  vatRate: number;

  @IsNotEmpty()
  @IsNumber()
  vatAmount: number;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsUUID()
  userId: string;

  @IsNotEmpty()
  @IsUUID()
  pricingElectricRuleId: string;
}

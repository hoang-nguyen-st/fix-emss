import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { PriceTypeEnum } from '@app/common/constants/enums';

export class CreatePriceTypeDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEnum(PriceTypeEnum)
  priceTypeEnum: PriceTypeEnum;

  @IsString()
  @IsOptional()
  description?: string;
}

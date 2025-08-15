import { LocationTypeDto } from '@app/modules/location-types/dto/location-types.dto';
import { Expose } from 'class-transformer';

export class TariffTierDto {
  @Expose()
  id: string;
  @Expose()
  name: string;

  @Expose()
  kwh: number;

  @Expose()
  unitPrice: number;

  @Expose()
  level: number;

  @Expose()
  locationType: LocationTypeDto;
}

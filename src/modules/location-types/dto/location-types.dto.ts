import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities';
import { LocationEntity } from '@app/modules/locations/entities';
import { PriceTypeLocationTypeEntity } from '@app/modules/price-types/entities';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities';
import { LocationTypeEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

export class LocationTypeDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  description: string;

  @Expose()
  isTariffTier: boolean;

  @Expose()
  locationTypeEnum: LocationTypeEnum;

  @Expose()
  locations: LocationEntity[];

  @Expose()
  tariffTiers: TariffTierEntity[];

  @Expose()
  locationTypeVoltageLevels: LocationTypeVoltageLevelEntity[];

  @Expose()
  priceTypeLocationTypes: PriceTypeLocationTypeEntity[];
}

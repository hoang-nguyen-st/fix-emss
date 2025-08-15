import { LocationTypeEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

export class LocationTypeNameDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  locationTypeEnum: LocationTypeEnum;
}

import { LocationStatusEnum } from '@app/common/constants/enums';
import { Expose, Type } from 'class-transformer';

export class LocationTypeSummaryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class UserSummaryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class DeviceSummaryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class PriceTypeSummaryDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class LocationDeviceSummaryDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => DeviceSummaryDto)
  device: DeviceSummaryDto;
}

export class LocationByWorkspaceDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  status: LocationStatusEnum;

  @Expose()
  createdAt: Date;

  @Expose()
  @Type(() => LocationTypeSummaryDto)
  locationType: LocationTypeSummaryDto;

  @Expose()
  @Type(() => UserSummaryDto)
  user: UserSummaryDto;

  @Expose()
  @Type(() => LocationDeviceSummaryDto)
  locationDevices: LocationDeviceSummaryDto[];

  @Expose()
  @Type(() => PriceTypeSummaryDto)
  priceType: PriceTypeSummaryDto;
}

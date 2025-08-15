import { Expose, Type } from 'class-transformer';

export class DeviceShortDto {
  @Expose()
  id: string;

  @Expose()
  name: string;
}

export class LocationDeviceShortDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => DeviceShortDto)
  device: DeviceShortDto;
}

export class UserShortDto {
  @Expose()
  name: string;
}

export class LocationTypeShortDto {
  @Expose()
  name: string;

  @Expose()
  description: string;
}

export class PriceTypeShortDto {
  @Expose()
  name: string;
}

export class LocationDeviceDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  initialDate: Date;

  @Expose()
  description: string;

  @Expose()
  @Type(() => UserShortDto)
  user: UserShortDto;

  @Expose()
  @Type(() => LocationTypeShortDto)
  locationType: LocationTypeShortDto;

  @Expose()
  @Type(() => PriceTypeShortDto)
  priceType: PriceTypeShortDto;

  @Expose()
  @Type(() => LocationDeviceShortDto)
  locationDevices: LocationDeviceShortDto[];
}

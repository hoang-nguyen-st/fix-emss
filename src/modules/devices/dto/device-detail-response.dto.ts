import { Expose, Type } from 'class-transformer';

export class LocationDeviceDetailDto {
  @Expose()
  id: string;

  @Expose()
  initialIndex: number;

  @Expose()
  currentIndex: number;

  @Expose()
  periodStartIndex: number;

  @Expose()
  consumption: number;
}

export class DeviceDetailResponseDto {
  @Expose()
  id: string;

  @Expose()
  @Type(() => LocationDeviceDetailDto)
  locationDevices: LocationDeviceDetailDto[];
}

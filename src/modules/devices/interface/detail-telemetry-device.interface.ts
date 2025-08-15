import { DeviceEntity } from '../entities';

export interface DetailTelemetryDeviceInterface {
  device: DeviceEntity;
  lastestTimeSeriesValue: string | null;
}

export interface DeviceWithInitDto {
  deviceId: string;
  initialIndex: number;
}

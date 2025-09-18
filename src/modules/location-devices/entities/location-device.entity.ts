import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { Expose } from 'class-transformer';

@Entity('location_devices')
export class LocationDeviceEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'initial_index' })
  initialIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'current_index' })
  currentIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'period_start_index' })
  periodStartIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'mid_start_index' })
  midStartIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'mid_current_index' })
  midCurrentIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'peak_start_index' })
  peakStartIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'peak_current_index' })
  peakCurrentIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'off_peak_start_index' })
  offPeakStartIndex: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'off_peak_current_index' })
  offPeakCurrentIndex: number;

  @Expose()
  @Column({ type: 'uuid', name: 'device_id' })
  deviceId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'location_id' })
  locationId: string;

  @ManyToOne(() => DeviceEntity, (device) => device.locationDevices)
  @JoinColumn({ name: 'device_id' })
  device: DeviceEntity;

  @ManyToOne(() => LocationEntity, (location) => location.locationDevices)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;
}

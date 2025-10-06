import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { Expose } from 'class-transformer';
import { DeviceLabel } from '@Constant/enums';

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
  @Column({ type: 'numeric', nullable: true, name: 'weekday_peak' })
  weekdayPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'weekday_mid_peak' })
  weekdayMidPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'weekday_off_peak' })
  weekdayOffPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'weekend_mid_peak' })
  weekendMidPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'weekend_off_peak' })
  weekendOffPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'period_weekday_peak' })
  periodWeekdayPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'period_weekday_mid_peak' })
  periodWeekdayMidPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'period_weekday_off_peak' })
  periodWeekdayOffPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'period_weekend_mid_peak' })
  periodWeekendMidPeak: number;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'period_weekend_off_peak' })
  periodWeekendOffPeak: number;

  @Expose()
  @Column({
    type: 'enum',
    enum: DeviceLabel,
    default: DeviceLabel.BRANCH,
    name: 'label',
  })
  label: DeviceLabel;

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

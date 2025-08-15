import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@app/common/entities';
import { DeviceTypeEnum, MeterTypeEnum, VoltageUnitEnum } from '@app/common/constants/enums';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { Expose } from 'class-transformer';

@Entity('devices')
export class DeviceEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'dev_eui' })
  devEUI: string;

  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'name' })
  name: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: DeviceTypeEnum,
    name: 'device_type',
    nullable: true,
  })
  deviceType: DeviceTypeEnum;

  @Expose()
  @Column({ type: 'varchar', nullable: true, length: 255, name: 'description' })
  description: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, length: 255, name: 'field_calculate' })
  fieldCalculate: string;

  @Expose()
  @Column({
    type: 'enum',
    enum: VoltageUnitEnum,
    nullable: true,
    name: 'voltage_unit',
  })
  voltageUnit: VoltageUnitEnum;

  @Expose()
  @Column({ type: 'numeric', nullable: true, name: 'voltage_value' })
  voltageValue: number;

  @Expose()
  @Column({ type: 'boolean', default: true, name: 'status' })
  status: boolean;

  @Expose()
  @Column({
    type: 'enum',
    enum: MeterTypeEnum,
    nullable: true,
    name: 'meter_type',
  })
  meterType: MeterTypeEnum;

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
  @Column({ type: 'uuid', name: 'workspace_id' })
  workspaceId: string;

  @Expose()
  @Column({ type: 'uuid', nullable: true, name: 'location_id' })
  locationId: string;

  @ManyToOne(() => WorkspaceEntity)
  @JoinColumn({ name: 'workspace_id' })
  workspace: WorkspaceEntity;

  @ManyToOne(() => LocationEntity)
  @JoinColumn({ name: 'location_id' })
  location: LocationEntity;

  @OneToMany(() => LocationDeviceEntity, (locationDevice) => locationDevice.device)
  locationDevices: LocationDeviceEntity[];
}

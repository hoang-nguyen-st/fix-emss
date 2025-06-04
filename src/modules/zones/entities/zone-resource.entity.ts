import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { ZoneEntity } from './zone.entity';

@Entity('zone_resources')
export class ZoneResourceEntity extends AbstractEntity {
  @Column({ type: 'enum', enum: ['electric', 'water', 'gas'] })
  resource: string;

  @Column({ type: 'varchar' })
  deviceId: string;

  @Column({ type: 'varchar' })
  deviceName: string;

  @ManyToOne(() => ZoneEntity, (zone) => zone.resources)
  @JoinColumn({ name: 'zone_id' })
  zone: ZoneEntity;
}

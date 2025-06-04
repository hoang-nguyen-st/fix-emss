import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';

@Entity('meter_types')
export class MeterTypeEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  consumtion: number;
}

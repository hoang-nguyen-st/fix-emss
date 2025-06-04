import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';

@Entity('voltage_levels')
export class VoltageLevelEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'int' })
  consumtion: number;
}

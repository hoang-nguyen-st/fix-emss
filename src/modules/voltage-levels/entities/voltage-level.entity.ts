import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { VoltageLevelEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

@Entity('voltage_levels')
export class VoltageLevelEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Expose()
  @Column({ type: 'numeric', name: 'from_voltage' })
  fromVoltage: number;

  @Expose()
  @Column({ type: 'numeric', name: 'to_voltage' })
  toVoltage: number;

  @Expose()
  @Column({ type: 'enum', enum: VoltageLevelEnum, name: 'voltage_level_enum' })
  voltageLevelEnum: VoltageLevelEnum;

  @Expose()
  @OneToMany(() => LocationTypeVoltageLevelEntity, (ltvl) => ltvl.voltageLevel)
  locationTypeVoltageLevels: LocationTypeVoltageLevelEntity[];
}

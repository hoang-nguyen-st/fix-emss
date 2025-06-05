import { Entity, Column, ManyToOne } from 'typeorm';
import { MeterTypeEntity } from './meter-type.entity';
import { AbstractEntity } from '@Entity/abstract.entity';
import { DayType, TimeSlotName } from '@Constant/enums';

@Entity('time_slots')
export class TimeSlotsEntity extends AbstractEntity {
  @Column({
    type: 'enum',
    enum: TimeSlotName,
  })
  name: TimeSlotName;

  @Column({
    type: 'enum',
    enum: DayType,
  })
  dayType: DayType;

  @Column('time')
  startTime: string;

  @Column('time')
  endTime: string;

  @ManyToOne(() => MeterTypeEntity, (meterType) => meterType.timeSlots)
  meterType: MeterTypeEntity;
}

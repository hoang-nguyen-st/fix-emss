import { Entity, Column } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { TimeSlotNameEnum, TimeSlotDayTypeEnum } from '@Constant/enums';
import { Expose } from 'class-transformer';

@Entity('time_slots')
export class TimeSlotEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'enum', enum: TimeSlotNameEnum, name: 'name' })
  name: TimeSlotNameEnum;

  @Expose()
  @Column({ type: 'enum', enum: TimeSlotDayTypeEnum, name: 'day_type' })
  dayType: TimeSlotDayTypeEnum;

  @Expose()
  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Expose()
  @Column({ type: 'time', name: 'end_time' })
  endTime: string;
}

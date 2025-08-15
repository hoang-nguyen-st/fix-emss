import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TimeSlotEntity } from '@app/modules/price-types/entities';
import { TimeSlotDayTypeEnum, TimeSlotNameEnum } from '@Constant/enums';

export class TimeSlotsSeeder implements Seeder {
  constructor(
    @InjectRepository(TimeSlotEntity)
    private readonly timeSlotsRepository: Repository<TimeSlotEntity>
  ) {}

  async seed(): Promise<any> {
    await this.timeSlotsRepository.insert([
      {
        name: TimeSlotNameEnum.MID_PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKDAY,
        startTime: '04:00:00',
        endTime: '09:30:00',
      },
      {
        name: TimeSlotNameEnum.PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKDAY,
        startTime: '09:30:00',
        endTime: '11:30:00',
      },
      {
        name: TimeSlotNameEnum.MID_PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKDAY,
        startTime: '11:30:00',
        endTime: '17:00:00',
      },
      {
        name: TimeSlotNameEnum.PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKDAY,
        startTime: '17:00:00',
        endTime: '20:00:00',
      },
      {
        name: TimeSlotNameEnum.MID_PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKDAY,
        startTime: '20:00:00',
        endTime: '22:00:00',
      },
      {
        name: TimeSlotNameEnum.OFF_PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKDAY,
        startTime: '22:00:00',
        endTime: '04:00:00',
      },
      {
        name: TimeSlotNameEnum.MID_PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKEND,
        startTime: '04:00:00',
        endTime: '22:00:00',
      },
      {
        name: TimeSlotNameEnum.OFF_PEAK,
        dayType: TimeSlotDayTypeEnum.WEEKEND,
        startTime: '22:00:00',
        endTime: '04:00:00',
      },
    ]);
  }

  async drop(): Promise<any> {
    await this.timeSlotsRepository.delete({});
  }
}

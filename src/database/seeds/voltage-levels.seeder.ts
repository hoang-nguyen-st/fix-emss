import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { VoltageLevelEnum, VoltageLevelName } from '@Constant/enums';

export class VoltageLevelsSeeder implements Seeder {
  constructor(
    @InjectRepository(VoltageLevelEntity)
    private readonly voltageLevelRepository: Repository<VoltageLevelEntity>
  ) {}

  async seed(): Promise<any> {
    await this.voltageLevelRepository.insert([
      { name: VoltageLevelName.BELOW_6KV, fromVoltage: 0, toVoltage: 6, voltageLevelEnum: VoltageLevelEnum.BELOW_6KV },
      {
        name: VoltageLevelName.ABOVE_22KV,
        fromVoltage: 22,
        toVoltage: 1000,
        voltageLevelEnum: VoltageLevelEnum.ABOVE_22KV,
      },
      {
        name: VoltageLevelName.FROM_6_TO_BELOW_22KV,
        fromVoltage: 6,
        toVoltage: 22,
        voltageLevelEnum: VoltageLevelEnum.FROM_6_TO_BELOW_22KV,
      },
      {
        name: VoltageLevelName.FROM_22_TO_BELOW_110KV,
        fromVoltage: 22,
        toVoltage: 110,
        voltageLevelEnum: VoltageLevelEnum.FROM_22_TO_BELOW_110KV,
      },
      {
        name: VoltageLevelName.ABOVE_110KV,
        fromVoltage: 110,
        toVoltage: 1000,
        voltageLevelEnum: VoltageLevelEnum.ABOVE_110KV,
      },
    ]);
  }

  async drop(): Promise<any> {
    await this.voltageLevelRepository.delete({});
  }
}

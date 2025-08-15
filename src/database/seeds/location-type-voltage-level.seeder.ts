import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { LocationTypeName, VoltageLevelName } from '@Constant/enums';

export class LocationTypeVoltageLevelSeeder implements Seeder {
  constructor(
    @InjectRepository(LocationTypeVoltageLevelEntity)
    private readonly locationTypeVoltageLevelRepository: Repository<LocationTypeVoltageLevelEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>,
    @InjectRepository(VoltageLevelEntity)
    private readonly voltageLevelRepository: Repository<VoltageLevelEntity>
  ) {}

  async seed(): Promise<any> {
    const businessType = await this.locationTypeRepository.findOne({
      where: { name: LocationTypeName.BUSINESS },
    });
    const productionType = await this.locationTypeRepository.findOne({
      where: { name: LocationTypeName.PRODUCTION },
    });

    const below6KV = await this.voltageLevelRepository.findOne({
      where: { name: VoltageLevelName.BELOW_6KV },
    });
    const from6ToBelow22KV = await this.voltageLevelRepository.findOne({
      where: { name: VoltageLevelName.FROM_6_TO_BELOW_22KV },
    });
    const above22KV = await this.voltageLevelRepository.findOne({
      where: { name: VoltageLevelName.ABOVE_22KV },
    });
    const from22ToBelow110KV = await this.voltageLevelRepository.findOne({
      where: { name: VoltageLevelName.FROM_22_TO_BELOW_110KV },
    });
    const above110KV = await this.voltageLevelRepository.findOne({
      where: { name: VoltageLevelName.ABOVE_110KV },
    });

    const businessRecords = [
      { locationType: businessType, voltageLevel: below6KV },
      { locationType: businessType, voltageLevel: from6ToBelow22KV },
      { locationType: businessType, voltageLevel: above22KV },
    ];

    const productionRecords = [
      { locationType: productionType, voltageLevel: below6KV },
      { locationType: productionType, voltageLevel: from6ToBelow22KV },
      { locationType: productionType, voltageLevel: from22ToBelow110KV },
      { locationType: productionType, voltageLevel: above110KV },
    ];

    const allRecords = [...businessRecords, ...productionRecords];

    await this.locationTypeVoltageLevelRepository.insert(allRecords);
  }

  async drop(): Promise<any> {
    await this.locationTypeVoltageLevelRepository.delete({});
  }
}

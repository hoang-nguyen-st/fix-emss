import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffTierEntity } from '@app/modules/tariff-tiers/entities/tariff-tier.entity';
import { TariffTierName, LocationTypeName, TariffTierEnum } from '@Constant/enums';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';

export class TariffTiersSeeder implements Seeder {
  constructor(
    @InjectRepository(TariffTierEntity)
    private readonly tariffTierRepository: Repository<TariffTierEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>
  ) {}

  async seed(): Promise<any> {
    const residentialTypeId = await this.locationTypeRepository.findOne({
      where: { name: LocationTypeName.RESIDENTIAL },
    });

    await this.tariffTierRepository.insert([
      {
        name: TariffTierName.TIER_1,
        unitPrice: 1984,
        kwh: 50,
        level: 1,
        locationType: residentialTypeId,
        tariffTierEnum: TariffTierEnum.TIER_1,
      },
      {
        name: TariffTierName.TIER_2,
        unitPrice: 2050,
        kwh: 50,
        level: 2,
        locationType: residentialTypeId,
        tariffTierEnum: TariffTierEnum.TIER_2,
      },
      {
        name: TariffTierName.TIER_3,
        unitPrice: 2380,
        kwh: 100,
        level: 3,
        locationType: residentialTypeId,
        tariffTierEnum: TariffTierEnum.TIER_3,
      },
      {
        name: TariffTierName.TIER_4,
        unitPrice: 2998,
        kwh: 100,
        level: 4,
        locationType: residentialTypeId,
        tariffTierEnum: TariffTierEnum.TIER_4,
      },
      {
        name: TariffTierName.TIER_5,
        unitPrice: 3350,
        kwh: 100,
        level: 5,
        locationType: residentialTypeId,
        tariffTierEnum: TariffTierEnum.TIER_5,
      },
      {
        name: TariffTierName.TIER_6,
        unitPrice: 3460,
        kwh: 0,
        level: 6,
        locationType: residentialTypeId,
        tariffTierEnum: TariffTierEnum.TIER_6,
      },
    ]);
  }

  async drop(): Promise<any> {
    await this.tariffTierRepository.delete({});
  }
}

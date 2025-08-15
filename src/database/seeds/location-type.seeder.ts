import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { LocationTypeEnum, LocationTypeName } from '@Constant/enums';

export class LocationTypeSeeder implements Seeder {
  constructor(
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>
  ) {}

  async seed(): Promise<any> {
    await this.locationTypeRepository.insert([
      {
        name: LocationTypeName.RESIDENTIAL,
        description: LocationTypeName.RESIDENTIAL,
        isTariffTier: true,
        locationTypeEnum: LocationTypeEnum.RESIDENTIAL,
      },
      {
        name: LocationTypeName.BUSINESS,
        description: LocationTypeName.BUSINESS,
        isTariffTier: false,
        locationTypeEnum: LocationTypeEnum.BUSINESS,
      },
      {
        name: LocationTypeName.PRODUCTION,
        description: LocationTypeName.PRODUCTION,
        isTariffTier: false,
        locationTypeEnum: LocationTypeEnum.PRODUCTION,
      },
    ]);
  }

  async drop(): Promise<any> {
    await this.locationTypeRepository.delete({});
  }
}

import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { PriceTypeEntity } from '@app/modules/price-types/entities/price-type.entity';
import { LocationTypeName, LocationStatusEnum, PriceTypeEnum } from '@Constant/enums';
import { UserEntity } from '@app/modules/users/entities/user.entity';

export class LocationSeeder implements Seeder {
  constructor(
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(PriceTypeEntity)
    private readonly priceTypeRepository: Repository<PriceTypeEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async seed(): Promise<any> {
    // Create or find workspace
    let workspace = await this.workspaceRepository.findOne({ where: { name: 'ST United' } });
    if (!workspace) {
      const newWorkspace = await this.workspaceRepository.save({
        name: 'ST United',
      });
      workspace = newWorkspace;
    }

    const residential = await this.locationTypeRepository.findOne({ where: { name: LocationTypeName.RESIDENTIAL } });
    const business = await this.locationTypeRepository.findOne({ where: { name: LocationTypeName.BUSINESS } });
    const production = await this.locationTypeRepository.findOne({ where: { name: LocationTypeName.PRODUCTION } });
    const priceType1 = await this.priceTypeRepository.findOne({ where: { priceTypeEnum: PriceTypeEnum.PRICE_TYPE_1 } });
    const priceType3 = await this.priceTypeRepository.findOne({ where: { priceTypeEnum: PriceTypeEnum.PRICE_TYPE_3 } });

    const user = await this.userRepository.findOne({ where: { email: 'hoang.nguyen@stunited.vn' } });

    if (!residential || !business || !production || !priceType1 || !priceType3) {
      throw new Error('Missing required reference data');
    }

    await this.locationRepository.insert([
      {
        name: 'Hộ sinh hoạt',
        status: LocationStatusEnum.ACTIVE,
        locationType: residential,
        workspace,
        priceType: null,
        user,
      },
      {
        name: 'Hộ kinh doanh 1 biểu giá',
        status: LocationStatusEnum.ACTIVE,
        locationType: business,
        workspace,
        priceType: priceType1,
        user,
      },
      {
        name: 'Hộ kinh doanh 3 biểu giá',
        status: LocationStatusEnum.ACTIVE,
        locationType: business,
        workspace,
        priceType: priceType3,
        user,
      },
      {
        name: 'Hộ sản xuất 1 biểu giá',
        status: LocationStatusEnum.ACTIVE,
        locationType: production,
        workspace,
        priceType: priceType1,
        user,
      },
      {
        name: 'Hộ sản xuất 3 biểu giá',
        status: LocationStatusEnum.ACTIVE,
        locationType: production,
        workspace,
        priceType: priceType3,
        user,
      },
    ]);
  }

  async drop(): Promise<any> {
    await this.locationRepository.delete({});
  }
}

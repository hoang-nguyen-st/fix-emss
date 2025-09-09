import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffTierEntity } from './entities/tariff-tier.entity';
import { ResponseItem } from '@app/common/dtos';
import { GetTariffTierDto } from './dto/get-tariff-tier.dto';
import { CreateManyTariffTiersDto } from './dto/tariff-tier.dto';
import { levelToEnum, levelToKwh, levelToName } from '@Constant/mapsData';
import { LocationTypeEntity, WorkspaceEntity } from '@Entity/index';

@Injectable()
export class TariffTiersService {
  constructor(
    @InjectRepository(TariffTierEntity)
    private readonly tariffTierRepository: Repository<TariffTierEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>
  ) {}

  async findAll(params: GetTariffTierDto): Promise<ResponseItem<TariffTierEntity[]>> {
    const { locationTypeId } = params;
    const query = this.tariffTierRepository.createQueryBuilder('tariffTier');
    if (locationTypeId) {
      query.where('tariffTier.locationType.id = :locationTypeId', { locationTypeId });
    }
    query.orderBy('tariffTier.level', 'ASC');
    query.leftJoinAndSelect('tariffTier.locationType', 'locationType');
    const tariffTiers = await query.getMany();
    return new ResponseItem<TariffTierEntity[]>(tariffTiers, 'Lấy danh sách biểu giá thành công!');
  }

  async createMany(dto: CreateManyTariffTiersDto) {
    const { workspaceId, locationTypeId, tiers } = dto;

    const existed = await this.tariffTierRepository.findOne({
      where: { workspaceId, locationTypeId },
    });
    if (existed) {
      throw new BadRequestException('Biểu giá lũy tiến cho workspace và loại hình thức này đã tồn tại.');
    }

    const workspace = await this.workspaceRepository.findOne({ where: { id: workspaceId } });
    if (!workspace) {
      throw new NotFoundException(`Workspace không tồn tại.`);
    }

    const locationType = await this.locationTypeRepository.findOne({ where: { id: locationTypeId } });
    if (!locationType) {
      throw new NotFoundException('Loại hình thức không tồn tại.');
    }

    if (!locationType.isTariffTier) {
      throw new BadRequestException('Loại hình thức không phải là Sinh hoạt.');
    }

    const sortedTiers = tiers.sort((a, b) => a.level - b.level);
    const entities = sortedTiers.map((t) =>
      this.tariffTierRepository.create({
        name: levelToName[t.level],
        tariffTierEnum: levelToEnum[t.level],
        kwh: t.kwh ?? levelToKwh[t.level],
        unitPrice: t.unitPrice,
        level: t.level,
        workspaceId,
        locationTypeId,
      })
    );

    return await this.tariffTierRepository.save(entities);
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffTierEntity } from './entities/tariff-tier.entity';
import { ResponseItem } from '@app/common/dtos';
import { GetTariffTierDto } from './dto/get-tariff-tier.dto';

@Injectable()
export class TariffTiersService {
  constructor(
    @InjectRepository(TariffTierEntity)
    private readonly tariffTierRepository: Repository<TariffTierEntity>
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
}

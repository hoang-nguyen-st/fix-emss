import { TariffTierEntity } from '@Entity/index';
import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GetTariffTierDto } from './dto/response/get-tariff-tier.dto';
import { Repository } from 'typeorm';
import { ResponseItem } from '@app/common/dtos';

@Injectable()
export class TariffTiersService {
  private readonly logger: Logger;

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

  async updateTariffTierPrice(tariffTierId: string, unitPrice: number): Promise<ResponseItem<TariffTierEntity>> {
    try {
      const tier = await this.tariffTierRepository.findOne({
        where: { id: tariffTierId },
      });

      if (!tier) {
        throw new NotFoundException('Không tìm thấy mức giá này');
      }

      Object.assign(tier, { unitPrice });

      const result = await this.tariffTierRepository.save(tier);

      return new ResponseItem(result, 'Cập nhật mức giá thành công');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi máy chủ khi cập nhật mức giá');
    }
  }
}

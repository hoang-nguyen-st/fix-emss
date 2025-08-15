import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceTypeEntity } from '@app/modules/price-types/entities/price-type.entity';
import { PriceTypeEnum, PriceTypeName } from '@Constant/enums';

export class PriceTypeSeeder implements Seeder {
  constructor(
    @InjectRepository(PriceTypeEntity)
    private readonly priceTypeRepository: Repository<PriceTypeEntity>
  ) {}

  async seed(): Promise<any> {
    const priceTypes = [
      {
        name: PriceTypeName.PRICE_TYPE_1,
        priceTypeEnum: PriceTypeEnum.PRICE_TYPE_1,
      },
      {
        name: PriceTypeName.PRICE_TYPE_3,
        priceTypeEnum: PriceTypeEnum.PRICE_TYPE_3,
      },
    ];

    for (const priceType of priceTypes) {
      const existingPriceType = await this.priceTypeRepository.findOne({
        where: { priceTypeEnum: priceType.priceTypeEnum },
      });

      if (!existingPriceType) {
        await this.priceTypeRepository.save(priceType);
      }
    }
  }

  async drop(): Promise<any> {
    await this.priceTypeRepository.delete({});
  }
}

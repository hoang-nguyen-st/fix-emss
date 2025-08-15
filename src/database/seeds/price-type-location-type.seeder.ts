import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceTypeLocationTypeEntity } from '@app/modules/price-types/entities/price-type-location-type.entity';
import { PriceTypeEntity } from '@app/modules/price-types/entities/price-type.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { PriceTypeEnum, LocationTypeEnum } from '@Constant/enums';

export class PriceTypeLocationTypeSeeder implements Seeder {
  constructor(
    @InjectRepository(PriceTypeLocationTypeEntity)
    private readonly priceTypeLocationTypeRepository: Repository<PriceTypeLocationTypeEntity>,
    @InjectRepository(PriceTypeEntity)
    private readonly priceTypeRepository: Repository<PriceTypeEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>
  ) {}

  async seed(): Promise<any> {
    const priceTypes = await this.priceTypeRepository.find();
    const locationTypes = await this.locationTypeRepository.find();

    const priceTypeLocationTypes = [
      {
        priceType: priceTypes.find((pt) => pt.priceTypeEnum === PriceTypeEnum.PRICE_TYPE_1),
        locationType: locationTypes.find((lt) => lt.locationTypeEnum === LocationTypeEnum.RESIDENTIAL),
      },
      {
        priceType: priceTypes.find((pt) => pt.priceTypeEnum === PriceTypeEnum.PRICE_TYPE_3),
        locationType: locationTypes.find((lt) => lt.locationTypeEnum === LocationTypeEnum.BUSINESS),
      },
      {
        priceType: priceTypes.find((pt) => pt.priceTypeEnum === PriceTypeEnum.PRICE_TYPE_3),
        locationType: locationTypes.find((lt) => lt.locationTypeEnum === LocationTypeEnum.PRODUCTION),
      },
    ];

    for (const priceTypeLocationType of priceTypeLocationTypes) {
      if (priceTypeLocationType.priceType && priceTypeLocationType.locationType) {
        const existingRelation = await this.priceTypeLocationTypeRepository.findOne({
          where: {
            priceType: priceTypeLocationType.priceType,
            locationType: priceTypeLocationType.locationType,
          },
        });

        if (!existingRelation) {
          await this.priceTypeLocationTypeRepository.save(priceTypeLocationType);
        }
      }
    }
  }

  async drop(): Promise<any> {
    await this.priceTypeLocationTypeRepository.delete({});
  }
}

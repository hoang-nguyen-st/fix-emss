import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { LocationTypeEntity } from '@app/modules/location-types/entities/location-type.entity';
import { PriceTypeEntity } from '@app/modules/price-types/entities';
import { LocationTypeName, VoltageLevelName, TimeUsageTypeEnum, PriceTypeEnum } from '@Constant/enums';

export class PricingElectricRuleSeeder implements Seeder {
  constructor(
    @InjectRepository(LocationTypeVoltageLevelEntity)
    private readonly locationTypeVoltageLevelRepository: Repository<LocationTypeVoltageLevelEntity>,
    @InjectRepository(PricingElectricRuleEntity)
    private readonly pricingElectricRuleRepository: Repository<PricingElectricRuleEntity>,
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>,
    @InjectRepository(PriceTypeEntity)
    private readonly priceTypeRepository: Repository<PriceTypeEntity>
  ) {}

  async seed(): Promise<any> {
    const businessType = await this.locationTypeRepository.findOne({
      where: { name: LocationTypeName.BUSINESS },
    });
    if (!businessType) {
      console.log('Business location type not found');
      return;
    }

    const businessLocationVoltageLevels = await this.locationTypeVoltageLevelRepository.find({
      where: { locationType: { id: businessType.id } },
      relations: ['locationType', 'voltageLevel'],
    });

    const productionType = await this.locationTypeRepository.findOne({
      where: { name: LocationTypeName.PRODUCTION },
    });
    if (!productionType) {
      console.log('Production location type not found');
      return;
    }

    const productionLocationVoltageLevels = await this.locationTypeVoltageLevelRepository.find({
      where: { locationType: { id: productionType.id } },
      relations: ['locationType', 'voltageLevel'],
    });

    const priceType1 = await this.priceTypeRepository.findOne({
      where: { priceTypeEnum: PriceTypeEnum.PRICE_TYPE_1 },
    });
    const priceType3 = await this.priceTypeRepository.findOne({
      where: { priceTypeEnum: PriceTypeEnum.PRICE_TYPE_3 },
    });

    if (priceType1) {
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3152,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType1,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3108,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType1,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 2887,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_22KV
        ),
        priceType: priceType1,
      });
    }

    if (priceType3) {
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3152,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 5422,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1918,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3108,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 5202,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1829,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 2887,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 5025,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1609,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: businessLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_22KV
        ),
        priceType: priceType3,
      });
    }

    if (priceType1) {
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1987,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType1,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1899,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType1,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1833,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_22_TO_BELOW_110KV
        ),
        priceType: priceType1,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1811,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_110KV
        ),
        priceType: priceType1,
      });
    }

    if (priceType3) {
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1987,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3640,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1300,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.BELOW_6KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1899,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3508,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1234,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_6_TO_BELOW_22KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1833,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_22_TO_BELOW_110KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3398,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_22_TO_BELOW_110KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1189,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.FROM_22_TO_BELOW_110KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1811,
        timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_110KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 3288,
        timeUsageEnum: TimeUsageTypeEnum.PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_110KV
        ),
        priceType: priceType3,
      });
      await this.pricingElectricRuleRepository.insert({
        unitPrice: 1144,
        timeUsageEnum: TimeUsageTypeEnum.OFF_PEAK,
        locationTypeVoltageLevel: productionLocationVoltageLevels.find(
          (lvl) => lvl.voltageLevel.name === VoltageLevelName.ABOVE_110KV
        ),
        priceType: priceType3,
      });
    }
  }

  async drop(): Promise<any> {
    await this.pricingElectricRuleRepository.delete({});
  }
}

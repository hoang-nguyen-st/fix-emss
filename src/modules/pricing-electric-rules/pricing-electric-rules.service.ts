import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { PricingElectricRuleEntity } from './entities/pricing-electric-rule.entity';
import { CreatePricingElectricRuleDto } from './dto/request/create-pricing-electric-rule.dto';
import { UpdatePriceByVoltAndPricingListDto } from './dto/request/update-pricing-electric-rule.dto';
import { ResponseItem } from '@app/common/dtos';
import { LocationTypeEntity } from '../location-types/entities';
import { TariffTierEntity } from '../tariff-tiers/entities';
import { LocationTypeVoltageLevelEntity } from '../location-type-voltage-levels/entities';
import { OrderEnum } from '@Constant/enums';

@Injectable()
export class PricingElectricRulesService {
  private readonly logger: Logger;
  constructor(
    @InjectRepository(PricingElectricRuleEntity)
    private readonly repository: Repository<PricingElectricRuleEntity>,

    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>,

    @InjectRepository(TariffTierEntity)
    private readonly tariffTierRepository: Repository<TariffTierEntity>,

    @InjectRepository(LocationTypeVoltageLevelEntity)
    private readonly ltvlRepository: Repository<LocationTypeVoltageLevelEntity>
  ) {}

  async create(createDto: CreatePricingElectricRuleDto): Promise<ResponseItem<PricingElectricRuleEntity>> {
    const entity = this.repository.create(createDto);
    const saved = await this.repository.save(entity);
    return new ResponseItem(saved, 'Tạo thành công');
  }

  async findAll(): Promise<PricingElectricRuleEntity[]> {
    return this.repository.find({
      where: { deletedAt: null },
    });
  }

  async findOne(id: string): Promise<PricingElectricRuleEntity> {
    const found = await this.repository.findOne({
      where: { id, deletedAt: null },
    });

    if (!found) {
      throw new NotFoundException('Không tìm thấy bản ghi');
    }

    return found;
  }

  async remove(id: string): Promise<ResponseItem<null>> {
    const entity = await this.findOne(id);
    entity.deletedAt = new Date();
    await this.repository.save(entity);
    return new ResponseItem(null, 'Xóa thành công');
  }

  async getPricingByLocationType(locationTypeId: string): Promise<ResponseItem<any>> {
    const locationType = await this.locationTypeRepository.findOne({
      where: { id: locationTypeId },
    });

    if (!locationType) {
      throw new NotFoundException('Không tìm thấy loại hình thức này');
    }

    if (locationType.isTariffTier) {
      const tiers = await this.tariffTierRepository.find({
        where: {
          locationType: {
            id: locationTypeId,
          },
        },
        relations: ['locationType'],
        order: { level: OrderEnum.ASC },
      });

      return new ResponseItem(tiers, 'Tìm thấy các mức giá');
    } else {
      const ltvlList = await this.ltvlRepository.find({
        where: { locationType: { id: locationTypeId } },
      });

      if (!ltvlList.length) {
        return new ResponseItem([], 'Không tìm thấy quy tắc giá cho loại hình thức này');
      }

      const ltvlIds = ltvlList.map((ltvl) => ltvl.id);

      const pricingRules = await this.repository.find({
        where: {
          locationTypeVoltageLevel: {
            id: In(ltvlIds),
          },
        },
        order: {
          priceType: { name: OrderEnum.ASC },
        },
        relations: ['locationTypeVoltageLevel', 'locationTypeVoltageLevel.voltageLevel', 'priceType'],
      });

      const grouped = Object.values(
        pricingRules.reduce((acc, rule) => {
          const priceTypeKey = rule.priceType.id;

          if (!acc[priceTypeKey]) {
            acc[priceTypeKey] = {
              id: rule.priceType.id,
              name: rule.priceType.name,
              priceTypeEnum: rule.priceType.priceTypeEnum,
              rulesByVoltageLevel: [],
            };
          }

          const voltageLevelKey = rule.locationTypeVoltageLevel.voltageLevel.id;

          let voltageGroup = acc[priceTypeKey].rulesByVoltageLevel.find((g) => g.voltageLevel.id === voltageLevelKey);

          if (!voltageGroup) {
            voltageGroup = {
              voltageLevel: {
                id: rule.locationTypeVoltageLevel.voltageLevel.id,
                name: rule.locationTypeVoltageLevel.voltageLevel.name,
                fromVoltage: rule.locationTypeVoltageLevel.voltageLevel.fromVoltage,
                toVoltage: rule.locationTypeVoltageLevel.voltageLevel.toVoltage,
              },
              rules: [],
            };
            acc[priceTypeKey].rulesByVoltageLevel.push(voltageGroup);
          }

          voltageGroup.rules.push({
            id: rule.id,
            unitPrice: rule.unitPrice,
            timeUsageEnum: rule.timeUsageEnum,
          });

          return acc;
        }, {} as Record<string, any>)
      );

      const sortedGrouped = grouped.sort((a, b) => a.name.localeCompare(b.name));

      const timeUsageOrder = {
        off_peak: 0,
        mid_peak: 1,
        peak: 2,
      };

      sortedGrouped.forEach((group) => {
        group.rulesByVoltageLevel.sort((a, b) => a.voltageLevel.name.localeCompare(b.voltageLevel.name));

        group.rulesByVoltageLevel.forEach((voltageGroup) => {
          voltageGroup.rules.sort((a, b) => {
            const orderA = timeUsageOrder[a.timeUsage] ?? 999;
            const orderB = timeUsageOrder[b.timeUsage] ?? 999;
            return orderA - orderB;
          });
        });
      });

      return new ResponseItem(grouped, 'Danh sách quy tắc giá được lấy thành công');
    }
  }

  async updateTariffTierPrice(id: string, unitPrice: number): Promise<ResponseItem<TariffTierEntity>> {
    try {
      const tier = await this.tariffTierRepository.findOne({
        where: { id },
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

  async updatePricingRule(
    id: string,
    updateDto: UpdatePriceByVoltAndPricingListDto
  ): Promise<ResponseItem<PricingElectricRuleEntity>> {
    try {
      const rule = await this.repository.findOne({
        where: { id },
      });

      if (!rule) {
        throw new NotFoundException('Không tìm thấy thông tin cho quy tắc giá này');
      }

      if (updateDto.unitPrice !== undefined) {
        rule.unitPrice = updateDto.unitPrice;
      }

      if (updateDto.timeUsage !== undefined) {
        rule.timeUsageEnum = updateDto.timeUsage;
      }

      const updated = await this.repository.save(rule);
      return new ResponseItem(updated, 'Cập nhật thành công');
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(error);
      throw new InternalServerErrorException('Lỗi máy chủ khi cập nhật quy tắc giá điện');
    }
  }
}

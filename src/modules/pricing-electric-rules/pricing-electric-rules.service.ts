import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, Repository } from 'typeorm';
import { PricingElectricRuleEntity } from './entities/pricing-electric-rule.entity';
import { BulkCreatePricingElectricRulesDto } from './dto/request/create-pricing-electric-rule.dto';
import { UpdatePriceByVoltAndPricingListDto } from './dto/request/update-pricing-electric-rule.dto';
import { ResponseItem } from '@app/common/dtos';
import { LocationTypeEntity } from '../location-types/entities';
import { TariffTierEntity } from '../tariff-tiers/entities';
import { LocationTypeVoltageLevelEntity } from '../location-type-voltage-levels/entities';
import { OrderEnum, PriceTypeEnum, TimeUsageTypeEnum } from '@Constant/enums';
import { PriceTypeEntity, PriceTypeLocationTypeEntity, VoltageLevelEntity, WorkspaceEntity } from '@Entity/index';
import {
  MeterTypePricing,
  PriceTypeTemplateDto,
  PricingTemplateResponseData,
  TariffTierTemplateDto,
} from './dto/response/pricing-electric-rule.dto';

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
    private readonly ltvlRepository: Repository<LocationTypeVoltageLevelEntity>,

    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,

    @InjectRepository(VoltageLevelEntity)
    private readonly voltageLevelRepository: Repository<VoltageLevelEntity>,

    @InjectRepository(PriceTypeEntity)
    private readonly priceTypeRepository: Repository<PriceTypeEntity>,

    @InjectRepository(PriceTypeLocationTypeEntity)
    private readonly priceTypeLocationTypeRepository: Repository<PriceTypeLocationTypeEntity>
  ) {}

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

  async getPricingByLocationType(
    workspaceId: string,
    locationTypeId: string
  ): Promise<ResponseItem<TariffTierEntity[] | MeterTypePricing>> {
    const workspace = await this.workspaceRepository.findOne({
      where: { id: workspaceId },
    });
    if (!workspace) {
      throw new NotFoundException('Workspace không tồn tại');
    }

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
          workspaceId,
        },
        relations: ['locationType'],
        order: { level: OrderEnum.ASC },
      });

      if (!tiers.length) {
        return new ResponseItem(
          [],
          `Không tìm thấy quy tắc giá cho loại hình thức ${locationType.name} trong ${workspace.name}`
        );
      }

      return new ResponseItem<TariffTierEntity[]>(tiers, 'Danh sách mức giá lũy tiến');
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
          workspaceId,
        },
        order: {
          priceType: { name: OrderEnum.ASC },
        },
        relations: ['locationTypeVoltageLevel', 'locationTypeVoltageLevel.voltageLevel', 'priceType'],
      });

      if (!pricingRules.length) {
        return new ResponseItem(
          [],
          `Không tìm thấy quy tắc giá cho loại hình thức ${locationType.name} trong ${workspace.name}`
        );
      }

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

  async bulkCreatePricingElectricRules(
    dto: BulkCreatePricingElectricRulesDto
  ): Promise<ResponseItem<PricingElectricRuleEntity[]>> {
    try {
      const workspace = await this.workspaceRepository.findOne({
        where: { id: dto.workspaceId },
      });
      if (!workspace) {
        throw new NotFoundException('Workspace không tồn tại');
      }

      const locationType = await this.locationTypeRepository.findOne({
        where: { id: dto.locationTypeId },
      });
      if (!locationType) {
        throw new NotFoundException('Loại hình thức không tồn tại');
      }
      if (locationType.isTariffTier === true) {
        throw new BadRequestException('Loại hình thức không phù hợp');
      }

      const allPriceTypeIds = dto.pricingRules.map((rule) => rule.priceTypeId);
      const allVoltageLevelIds = dto.pricingRules.flatMap((rule) => rule.voltageRules.map((vr) => vr.voltageLevelId));

      const priceTypes = await this.priceTypeRepository.find({
        where: { id: In(allPriceTypeIds) },
      });
      if (priceTypes.length !== allPriceTypeIds.length) {
        const foundIds = priceTypes.map((pt) => pt.id);
        const missingIds = allPriceTypeIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(`Biểu giá không tồn tại: ${missingIds.join(', ')}`);
      }

      const voltageLevels = await this.voltageLevelRepository.find({
        where: { id: In(allVoltageLevelIds) },
      });
      if (voltageLevels.length !== [...new Set(allVoltageLevelIds)].length) {
        const foundIds = voltageLevels.map((vl) => vl.id);
        const uniqueVoltageLevelIds = [...new Set(allVoltageLevelIds)];
        const missingIds = uniqueVoltageLevelIds.filter((id) => !foundIds.includes(id));
        throw new NotFoundException(`Voltage levels không tồn tại: ${missingIds.join(', ')}`);
      }

      const locationTypeVoltageLevels = await this.ltvlRepository.find({
        where: {
          locationTypeId: dto.locationTypeId,
          voltageLevelId: In([...new Set(allVoltageLevelIds)]),
        },
      });
      const foundLtvlIds = locationTypeVoltageLevels.map((ltvl) => ltvl.voltageLevelId);
      const uniqueVoltageLevelIds = [...new Set(allVoltageLevelIds)];
      const missingLtvlIds = uniqueVoltageLevelIds.filter((id) => !foundLtvlIds.includes(id));

      if (missingLtvlIds.length > 0) {
        throw new NotFoundException(
          `Location type voltage levels không tồn tại cho voltage levels: ${missingLtvlIds.join(', ')}`
        );
      }
      const ltvlMapping = new Map(locationTypeVoltageLevels.map((ltvl) => [ltvl.voltageLevelId, ltvl.id]));

      const rulesToCreate: Partial<PricingElectricRuleEntity>[] = [];

      for (const pricingRule of dto.pricingRules) {
        for (const voltageRule of pricingRule.voltageRules) {
          const locationTypeVoltageLevelId = ltvlMapping.get(voltageRule.voltageLevelId);

          rulesToCreate.push({
            unitPrice: voltageRule.unitPrice,
            locationTypeVoltageLevelId,
            priceTypeId: pricingRule.priceTypeId,
            timeUsageEnum: voltageRule.timeUsageEnum,
            workspaceId: dto.workspaceId,
          });
        }
      }

      const createdRules = await this.repository.save(rulesToCreate);

      return new ResponseItem<PricingElectricRuleEntity[]>(
        createdRules,
        `Setting giá tiền cho hộ ${locationType.name} thành công`
      );
    } catch (error) {
      if (error instanceof NotFoundException || error instanceof BadRequestException) {
        throw error;
      }

      this.logger.error(error);
      throw new InternalServerErrorException('Có lỗi xảy ra khi cài đặt giá điện');
    }
  }

  async getPricingTemplateByLocationType(locationTypeId: string): Promise<ResponseItem<PricingTemplateResponseData>> {
    const locationType = await this.locationTypeRepository.findOne({
      where: { id: locationTypeId },
    });

    if (!locationType) {
      throw new NotFoundException('Không tìm thấy loại hình thức này');
    }

    if (locationType.isTariffTier) {
      const existingTiers = await this.tariffTierRepository.find({
        where: {
          locationType: {
            id: locationTypeId,
          },
          workspaceId: IsNull(),
        },
        relations: ['locationType'],
        order: { level: OrderEnum.ASC },
      });

      const tierTemplates = existingTiers.map((tier) => ({
        id: tier.id,
        name: tier.name,
        kwh: tier.kwh,
        unitPrice: null,
        level: tier.level,
        tariffTierEnum: tier.tariffTierEnum,
        locationTypeId: tier.locationTypeId,
      }));

      return new ResponseItem<TariffTierTemplateDto[]>(tierTemplates, 'Template mức giá lũy tiến');
    } else {
      const ltvlList = await this.ltvlRepository.find({
        where: { locationType: { id: locationTypeId } },
        relations: ['voltageLevel'],
      });

      if (!ltvlList.length) {
        return new ResponseItem([], 'Không tìm thấy voltage levels cho loại hình thức này');
      }

      const priceTypeLocationTypes = await this.priceTypeLocationTypeRepository.find({
        where: { locationTypeId: locationTypeId },
        relations: ['priceType'],
      });

      if (!priceTypeLocationTypes.length) {
        return new ResponseItem([], 'Không tìm thấy biểu giá cho loại hình thức này');
      }

      const priceTypes = priceTypeLocationTypes.map((ptlt) => ptlt.priceType);

      const timeUsageEnums = [TimeUsageTypeEnum.OFF_PEAK, TimeUsageTypeEnum.MID_PEAK, TimeUsageTypeEnum.PEAK];

      const templateGroups = priceTypes.map((priceType) => ({
        id: priceType.id,
        name: priceType.name,
        priceTypeEnum: priceType.priceTypeEnum,
        rulesByVoltageLevel: ltvlList.map((ltvl) => ({
          voltageLevel: {
            id: ltvl.voltageLevel.id,
            name: ltvl.voltageLevel.name,
            fromVoltage: ltvl.voltageLevel.fromVoltage,
            toVoltage: ltvl.voltageLevel.toVoltage,
          },
          rules:
            priceType.priceTypeEnum === PriceTypeEnum.PRICE_TYPE_3
              ? timeUsageEnums.map((timeUsage) => ({
                  id: null,
                  unitPrice: null,
                  timeUsageEnum: timeUsage,
                }))
              : [
                  {
                    id: null,
                    unitPrice: null,
                    timeUsageEnum: TimeUsageTypeEnum.MID_PEAK,
                  },
                ],
        })),
      }));

      const sortedGroups = templateGroups.sort((a, b) => a.name.localeCompare(b.name));

      const timeUsageOrder = {
        [TimeUsageTypeEnum.OFF_PEAK]: 0,
        [TimeUsageTypeEnum.MID_PEAK]: 1,
        [TimeUsageTypeEnum.PEAK]: 2,
      };

      sortedGroups.forEach((group) => {
        group.rulesByVoltageLevel.sort((a, b) => a.voltageLevel.fromVoltage - b.voltageLevel.fromVoltage);

        group.rulesByVoltageLevel.forEach((voltageGroup) => {
          voltageGroup.rules.sort((a, b) => {
            const orderA = timeUsageOrder[a.timeUsageEnum] ?? 999;
            const orderB = timeUsageOrder[b.timeUsageEnum] ?? 999;
            return orderA - orderB;
          });
        });
      });

      return new ResponseItem<PriceTypeTemplateDto[]>(sortedGroups, 'Template quy tắc giá được lấy thành công');
    }
  }
}

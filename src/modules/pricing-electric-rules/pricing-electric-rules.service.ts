import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PricingElectricRuleEntity } from './entities/pricing-electric-rule.entity';
import { CreatePricingElectricRuleDto } from './dto/create-pricing-electric-rule.dto';
import { MeterTypesService } from '../meter-types/meter-types.service';
import { VoltageLevelsService } from '../voltage-levels/voltage-levels.service';
import { ZonesService } from '../zones/zones.service';

@Injectable()
export class PricingElectricRulesService {
  constructor(
    @InjectRepository(PricingElectricRuleEntity)
    private readonly pricingElectricRuleRepository: Repository<PricingElectricRuleEntity>,
    private readonly meterTypesService: MeterTypesService,
    private readonly voltageLevelsService: VoltageLevelsService,
    private readonly zonesService: ZonesService
  ) {}

  async create(createPricingElectricRuleDto: CreatePricingElectricRuleDto): Promise<PricingElectricRuleEntity> {
    const [meterType, voltageLevel, zoneResource] = await Promise.all([
      this.meterTypesService.findOne(createPricingElectricRuleDto.meterTypeId),
      this.voltageLevelsService.findOne(createPricingElectricRuleDto.voltageLevelId),
      this.zonesService.findOne(createPricingElectricRuleDto.zoneResourceId),
    ]);

    const pricingElectricRule = this.pricingElectricRuleRepository.create({
      unitPrice: createPricingElectricRuleDto.unitPrice,
      meterType,
      voltageLevel,
      zoneResource,
    });

    return await this.pricingElectricRuleRepository.save(pricingElectricRule);
  }

  async findAll(): Promise<PricingElectricRuleEntity[]> {
    return await this.pricingElectricRuleRepository.find({
      relations: ['meterType', 'voltageLevel', 'zoneResource'],
    });
  }

  async findOne(id: string): Promise<PricingElectricRuleEntity> {
    const pricingElectricRule = await this.pricingElectricRuleRepository.findOne({
      where: { id },
      relations: ['meterType', 'voltageLevel', 'zoneResource'],
    });

    if (!pricingElectricRule) {
      throw new NotFoundException(`Pricing electric rule with ID ${id} not found`);
    }

    return pricingElectricRule;
  }
}

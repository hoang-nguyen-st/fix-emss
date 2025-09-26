import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TariffTierEntity } from '@Entity/index';
import { VoltageLevelEntity } from '@app/modules/voltage-levels/entities/voltage-level.entity';
import { LocationTypeVoltageLevelEntity } from '@app/modules/location-type-voltage-levels/entities/location-type-voltage-level.entity';
import { PricingElectricRuleEntity } from '@app/modules/pricing-electric-rules/entities/pricing-electric-rule.entity';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { InvoiceCalculationStrategy, InvoiceCalculationResult } from '../interfaces/invoice-calculation.interface';

@Injectable()
export abstract class InvoiceCalculationBaseStrategy implements InvoiceCalculationStrategy {
  constructor(
    @InjectRepository(TariffTierEntity)
    protected readonly tariffTierRepository: Repository<TariffTierEntity>,
    @InjectRepository(VoltageLevelEntity)
    protected readonly voltageLevelRepository: Repository<VoltageLevelEntity>,
    @InjectRepository(LocationTypeVoltageLevelEntity)
    protected readonly ltvlRepository: Repository<LocationTypeVoltageLevelEntity>,
    @InjectRepository(PricingElectricRuleEntity)
    protected readonly pricingRuleRepository: Repository<PricingElectricRuleEntity>
  ) {}

  abstract calculate(
    devices: LocationDeviceEntity[],
    workspaceId: string | undefined,
    locationTypeId: string,
    start?: Date,
    end?: Date
  ): Promise<InvoiceCalculationResult>;

  protected async getVoltageLevels(): Promise<VoltageLevelEntity[]> {
    return await this.voltageLevelRepository.find({
      order: { fromVoltage: 'ASC' },
    });
  }

  protected findMatchingVoltageLevel(voltageLevels: VoltageLevelEntity[], deviceVoltageValue: number) {
    return voltageLevels
      .filter((vl) => deviceVoltageValue >= Number(vl.fromVoltage) && deviceVoltageValue < Number(vl.toVoltage))
      .sort((a, b) => {
        const rangeA = Number(a.toVoltage) - Number(a.fromVoltage);
        const rangeB = Number(b.toVoltage) - Number(b.fromVoltage);
        return rangeA - rangeB;
      })[0];
  }
}

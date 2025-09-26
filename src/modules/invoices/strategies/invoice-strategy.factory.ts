import { Injectable } from '@nestjs/common';
import { LocationTypeEnum } from '@Constant/enums';
import { InvoiceCalculationStrategy } from './interfaces/invoice-calculation.interface';
import { ResidentialStrategy } from './residential.strategy';
import { BusinessStrategy } from './business.strategy';
import { ProductionStrategy } from './production.strategy';

@Injectable()
export class InvoiceStrategyFactory {
  constructor(
    private readonly residentialStrategy: ResidentialStrategy,
    private readonly businessStrategy: BusinessStrategy,
    private readonly productionStrategy: ProductionStrategy
  ) {}

  getStrategy(locationTypeEnum: LocationTypeEnum): InvoiceCalculationStrategy {
    switch (locationTypeEnum) {
      case LocationTypeEnum.RESIDENTIAL:
        return this.residentialStrategy;
      case LocationTypeEnum.BUSINESS:
        return this.businessStrategy;
      case LocationTypeEnum.PRODUCTION:
        return this.productionStrategy;
      default:
        throw new Error(`Unsupported location type: ${locationTypeEnum}`);
    }
  }
}

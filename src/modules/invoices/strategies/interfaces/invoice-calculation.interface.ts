import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { TariffResult, BusinessResult } from '../../dto/request/calculate-electric.dto';

export interface InvoiceCalculationResult {
  totalPrice: number;
  totalPriceWithVAT: number;
  details: TariffResult[] | BusinessResult[];
}

export interface InvoiceCalculationStrategy {
  calculate(
    devices: LocationDeviceEntity[],
    workspaceId: string | undefined,
    locationTypeId: string,
    start?: Date,
    end?: Date
  ): Promise<InvoiceCalculationResult>;
}

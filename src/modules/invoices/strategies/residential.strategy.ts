import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { InvoiceCalculationBaseStrategy } from './base/invoice-calculation-base.strategy';
import { TariffResult } from '../dto/request/calculate-electric.dto';
import { IsNull } from 'typeorm';

@Injectable()
export class ResidentialStrategy extends InvoiceCalculationBaseStrategy {
  async calculate(
    devices: LocationDeviceEntity[],
    workspaceId: string | undefined,
    locationTypeId: string,
    start?: Date,
    end?: Date
  ): Promise<{ totalPrice: number; totalPriceWithVAT: number; details: TariffResult[] }> {
    const ld = devices[0];
    const initIndex = ld.initialIndex;
    const currIndex = ld.currentIndex;

    if (initIndex == null || currIndex == null) {
      throw new BadRequestException('Chỉ số ban đầu hoặc hiện tại không có sẵn');
    }

    const consumption = Number(currIndex) - Number(initIndex);
    if (consumption < 0) {
      throw new BadRequestException('Mức tiêu thụ là âm. Kiểm tra các chỉ số đã lưu trữ.');
    }

    let priceTiers = await this.tariffTierRepository.find({
      where: { workspaceId, locationTypeId },
      order: { level: 'ASC' },
    });

    if (!priceTiers || priceTiers.length === 0) {
      priceTiers = await this.tariffTierRepository.find({
        where: { workspaceId: IsNull(), locationTypeId },
        order: { level: 'ASC' },
      });
    }

    if (!priceTiers || priceTiers.length === 0) {
      throw new NotFoundException(`Không tìm thấy bảng giá bậc thang phù hợp cho loại địa điểm này`);
    }

    const daysInPeriod =
      start && end ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) : 30;

    const Dref = 30;

    const kwhNumbers = priceTiers.map((t) => {
      const raw = Number(t.kwh ?? 0);
      if (raw === 0) return 0;
      return Math.round((raw * daysInPeriod) / Dref);
    });
    const unitPrices = priceTiers.map((t) => Number(t.unitPrice ?? 0));
    const levelNumbers = priceTiers.map((t) => Number(t.level ?? 0));

    const isCumulative = kwhNumbers.every((v, i) => (i === 0 ? v > 0 : v > kwhNumbers[i - 1]));

    let remaining = consumption;
    let totalPrice = 0;
    const details: TariffResult[] = [];

    if (isCumulative) {
      let prevCumulative = 0;
      for (let i = 0; i < priceTiers.length; i++) {
        const tierKwh = kwhNumbers[i];
        const unitPrice = unitPrices[i];
        const levelNum = levelNumbers[i];

        let capacity = tierKwh - prevCumulative;
        if (isNaN(capacity) || capacity < 0) capacity = 0;

        const used = remaining > 0 ? Math.min(remaining, capacity) : 0;
        const amount = used * unitPrice;

        details.push({ tierLevel: levelNum, kwh: used, unitPrice, amount: Math.round(amount) });

        totalPrice += amount;
        remaining -= used;
        prevCumulative = tierKwh;
      }

      if (remaining > 0) {
        const lastUnitPrice = unitPrices[unitPrices.length - 1];
        const lastLevelNum = levelNumbers[levelNumbers.length - 1];

        details.push({
          tierLevel: lastLevelNum + 1,
          kwh: remaining,
          unitPrice: lastUnitPrice,
          amount: Math.round(remaining * lastUnitPrice),
        });

        totalPrice += remaining * lastUnitPrice;
        remaining = 0;
      }
    } else {
      for (let i = 0; i < priceTiers.length; i++) {
        const tierKwh = kwhNumbers[i];
        const unitPrice = unitPrices[i];
        const levelNum = levelNumbers[i];

        if (tierKwh === 0) {
          const used = remaining > 0 ? remaining : 0;
          const amount = used * unitPrice;

          details.push({ tierLevel: levelNum, kwh: used, unitPrice, amount: Math.round(amount) });

          totalPrice += amount;
          remaining = 0;
          break;
        }

        const used = remaining > 0 ? Math.min(remaining, tierKwh) : 0;
        const amount = used * unitPrice;

        details.push({ tierLevel: levelNum, kwh: used, unitPrice, amount: Math.round(amount) });

        totalPrice += amount;
        remaining -= used;
      }

      if (remaining > 0) {
        const lastUnitPrice = unitPrices[unitPrices.length - 1];
        const lastLevelNum = levelNumbers[levelNumbers.length - 1];

        details.push({
          tierLevel: lastLevelNum + 1,
          kwh: remaining,
          unitPrice: lastUnitPrice,
          amount: Math.round(remaining * lastUnitPrice),
        });

        totalPrice += remaining * lastUnitPrice;
        remaining = 0;
      }
    }

    const totalRounded = Math.round(totalPrice);
    const totalPriceWithVAT = Math.round(totalPrice * 1.08);

    return { totalPrice: totalRounded, totalPriceWithVAT, details };
  }
}

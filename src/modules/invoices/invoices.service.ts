import { InvoiceEntity, TariffTierEntity } from '@Entity/index';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationDeviceEntity } from '../location-devices/entities';
import { CalculateElectricDto, TariffResult } from './dto/request/calculate-electric.dto';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,

    @InjectRepository(LocationDeviceEntity)
    private readonly locationDeviceRepository: Repository<LocationDeviceEntity>,

    @InjectRepository(TariffTierEntity)
    private readonly tariffTierRepository: Repository<TariffTierEntity>
  ) {}

  async calculateElectric(dto: CalculateElectricDto) {
    const { locationDeviceId, workspaceId, startDate, endDate } = dto;

    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : new Date();

    if (endDate) {
      end.setHours(23, 59, 59, 999);
    }

    const ld = await this.locationDeviceRepository.findOne({
      where: { id: locationDeviceId },
    });

    if (!ld) {
      throw new NotFoundException();
    }

    const initIndex = ld.initialIndex;
    const currIndex = ld.currentIndex;

    if (initIndex == null || currIndex == null) {
      throw new BadRequestException('Chỉ số ban đầu hoặc hiện tại không có sẵn');
    }

    const consumption = Number(currIndex) - Number(initIndex);
    if (consumption < 0) {
      throw new BadRequestException('Mức tiêu thụ là âm. Kiểm tra các chỉ số đã lưu trữ.');
    }

    const result = await this.computeEVNAmount(consumption, workspaceId, start, end);

    return { consumption, ...result };
  }

  private async computeEVNAmount(
    consumption: number,
    workspaceId: string,
    start?: Date,
    end?: Date
  ): Promise<{
    total: number;
    totalWithVAT: number;
    details: TariffResult[];
  }> {
    const priceTiers = await this.tariffTierRepository.find({
      where: { workspaceId },
      order: { level: 'ASC' },
    });

    if (!priceTiers || priceTiers.length === 0) {
      throw new NotFoundException(`No tariff tiers found for workspaceId=${workspaceId}`);
    }

    // --- Tính số ngày sử dụng thực tế ---
    const daysInPeriod =
      start && end ? Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24))) : 30;

    const Dref = 30;

    // --- chuẩn hóa số & scale lại kwh ---
    const kwhNumbers = priceTiers.map((t) => {
      const raw = Number(t.kwh ?? 0);
      if (raw === 0) return 0; // unlimited giữ nguyên
      return Math.round((raw * daysInPeriod) / Dref);
    });
    const unitPrices = priceTiers.map((t) => Number(t.unitPrice ?? 0));
    const levelNumbers = priceTiers.map((t) => Number(t.level ?? 0));

    const isCumulative = kwhNumbers.every((v, i) => (i === 0 ? v > 0 : v > kwhNumbers[i - 1]));

    let remaining = consumption;
    let total = 0;
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

        total += amount;
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

        total += remaining * lastUnitPrice;
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

          total += amount;
          remaining = 0;
          break;
        }

        const used = remaining > 0 ? Math.min(remaining, tierKwh) : 0;
        const amount = used * unitPrice;

        details.push({ tierLevel: levelNum, kwh: used, unitPrice, amount: Math.round(amount) });

        total += amount;
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

        total += remaining * lastUnitPrice;
        remaining = 0;
      }
    }

    const totalRounded = Math.round(total);
    const totalWithVAT = Math.round(total * 1.08);

    console.log('🚀 computeEVNAmount =>', { total: totalRounded, totalWithVAT, details, daysInPeriod });

    return { total: totalRounded, totalWithVAT, details };
  }
}

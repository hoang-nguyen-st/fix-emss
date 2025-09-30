import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { InvoiceCalculationBaseStrategy } from './base/invoice-calculation-base.strategy';
import { BusinessResult } from '../dto/request/calculate-electric.dto';

@Injectable()
export class BusinessStrategy extends InvoiceCalculationBaseStrategy {
  async calculate(
    devices: LocationDeviceEntity[],
    workspaceId: string | undefined,
    locationTypeId: string
  ): Promise<{ totalPrice: number; totalPriceWithVAT: number; details: BusinessResult[] }> {
    if (!workspaceId) {
      throw new BadRequestException('Không xác định được workspace để tính giá');
    }

    const voltageLevels = await this.getVoltageLevels();
    if (!voltageLevels.length) {
      throw new NotFoundException('Không tìm thấy định nghĩa mức điện áp');
    }

    let totalPrice = 0;
    const details: BusinessResult[] = [];

    for (let i = 0; i < devices.length; i++) {
      const ld = devices[i];
      const initIndex = ld.initialIndex;
      const currIndex = ld.currentIndex;
      if (initIndex == null || currIndex == null) {
        throw new BadRequestException(`Chỉ số ban đầu hoặc hiện tại không có sẵn cho thiết bị ${i + 1}`);
      }
      const consumption = Number(currIndex) - Number(initIndex);
      if (consumption < 0) {
        throw new BadRequestException(`Mức tiêu thụ là âm cho thiết bị ${i + 1}. Kiểm tra các chỉ số đã lưu trữ.`);
      }

      const deviceVoltageValue = Number(ld.device?.voltageValue);
      if (!deviceVoltageValue || isNaN(deviceVoltageValue)) {
        throw new BadRequestException(`Thiết bị ${i + 1} không có thông tin voltage value hợp lệ`);
      }

      const matchingVoltageLevel = this.findMatchingVoltageLevel(voltageLevels, deviceVoltageValue);

      if (!matchingVoltageLevel) {
        throw new BadRequestException(
          `Không tìm thấy mức điện áp phù hợp cho voltage value ${deviceVoltageValue} của thiết bị ${i + 1}`
        );
      }

      const ltvl = await this.ltvlRepository.findOne({
        where: {
          locationTypeId,
          voltageLevelId: matchingVoltageLevel.id,
        },
      });

      if (!ltvl) {
        throw new NotFoundException(
          `Không tìm thấy quy tắc điện áp cho loại hình thức KINH DOANH và mức điện áp ${matchingVoltageLevel.name}. Vui lòng kiểm tra bảng location_type_voltage_levels.`
        );
      }

      const pricingRule = await this.pricingRuleRepository.findOne({
        where: {
          workspaceId,
          locationTypeVoltageLevelId: ltvl.id,
        },
      });

      if (!pricingRule) {
        throw new NotFoundException(
          `Không tìm thấy đơn giá cho workspace và loại hình thức KINH DOANH với mức điện áp ${matchingVoltageLevel.name}. Vui lòng kiểm tra bảng pricing_electric_rules.`
        );
      }

      const unitPrice = Number(pricingRule.unitPrice ?? 0);
      const amount = Math.round(consumption * unitPrice);
      totalPrice += amount;
      details.push({
        id: ld.deviceId,
        name: ld.device?.name,
        consumption,
        unitPrice,
        amount,
        voltageValue: deviceVoltageValue,
        voltageLevel: matchingVoltageLevel.name,
      });
    }

    const totalPriceWithVAT = Math.round(totalPrice * 1.08);
    return { totalPrice, totalPriceWithVAT, details };
  }
}

import { TariffTierEnum, TariffTierName } from './enums';

export const levelToName: Record<number, TariffTierName> = {
  1: TariffTierName.TIER_1,
  2: TariffTierName.TIER_2,
  3: TariffTierName.TIER_3,
  4: TariffTierName.TIER_4,
  5: TariffTierName.TIER_5,
  6: TariffTierName.TIER_6,
};

export const levelToEnum: Record<number, TariffTierEnum> = {
  1: TariffTierEnum.TIER_1,
  2: TariffTierEnum.TIER_2,
  3: TariffTierEnum.TIER_3,
  4: TariffTierEnum.TIER_4,
  5: TariffTierEnum.TIER_5,
  6: TariffTierEnum.TIER_6,
};

export const levelToKwh: Record<number, number> = {
  1: 50,
  2: 50,
  3: 100,
  4: 100,
  5: 100,
  6: 0,
};

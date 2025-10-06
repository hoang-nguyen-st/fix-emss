export enum UserStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
  UNASSIGNED = 'unassigned',
}

export enum LocationStatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum OrderEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum UserRoleEnum {
  ADMIN = 'ADMIN',
  USER = 'USER',
  SUPER_ADMIN = 'SUPER_ADMIN',
}

export enum InvoiceStatusEnum {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum TimeSlotNameEnum {
  PEAK = 'Peak',
  OFF_PEAK = 'Off peak',
  MID_PEAK = 'Mid peak',
}

export enum TimeSlotDayTypeEnum {
  WEEKEND = 'weekend',
  WEEKDAY = 'weekday',
}

export enum DeviceTypeEnum {
  ELECTRIC = 'electric',
  WATER = 'water',
  GAS = 'gas',
}

export enum PriceTypeName {
  PRICE_TYPE_1 = '1 biểu giá',
  PRICE_TYPE_3 = '3 biểu giá',
}

export enum PriceTypeEnum {
  PRICE_TYPE_1 = 'PRICE_TYPE_1',
  PRICE_TYPE_3 = 'PRICE_TYPE_3',
}

export enum MeterTypeName {
  METER_TYPE_1 = '1 công tơ',
  METER_TYPE_3 = '3 công tơ',
}

export enum MeterTypeEnum {
  METER_TYPE_1 = 'METER_TYPE_1',
  METER_TYPE_3 = 'METER_TYPE_3',
}

export enum LocationTypeEnum {
  RESIDENTIAL = 'RESIDENTIAL',
  BUSINESS = 'BUSINESS',
  PRODUCTION = 'PRODUCTION',
}

export enum LocationTypeName {
  RESIDENTIAL = 'Hộ gia đình',
  BUSINESS = 'Kinh doanh',
  PRODUCTION = 'Sản xuất',
}

export enum VoltageLevelName {
  BELOW_6KV = 'Dưới 6 kV',
  FROM_6_TO_BELOW_22KV = 'Từ 6 kV đến dưới 22 kV',
  ABOVE_22KV = 'Trên 22 kV',
  FROM_22_TO_BELOW_110KV = 'Từ 22 kV đến dưới 110 kV',
  ABOVE_110KV = 'Trên 110 kV',
}

export enum VoltageLevelEnum {
  BELOW_6KV = 'BELOW_6KV',
  FROM_6_TO_BELOW_22KV = 'FROM_6_TO_BELOW_22KV',
  ABOVE_22KV = 'ABOVE_22KV',
  FROM_22_TO_BELOW_110KV = 'FROM_22_TO_BELOW_110KV',
  ABOVE_110KV = 'ABOVE_110KV',
}

export enum TariffTierName {
  TIER_1 = 'Bậc 1',
  TIER_2 = 'Bậc 2',
  TIER_3 = 'Bậc 3',
  TIER_4 = 'Bậc 4',
  TIER_5 = 'Bậc 5',
  TIER_6 = 'Bậc 6',
}

export enum TariffTierEnum {
  TIER_1 = 'TIER_1',
  TIER_2 = 'TIER_2',
  TIER_3 = 'TIER_3',
  TIER_4 = 'TIER_4',
  TIER_5 = 'TIER_5',
  TIER_6 = 'TIER_6',
}

export enum TimeUsageTypeEnum {
  PEAK = 'PEAK',
  OFF_PEAK = 'OFF_PEAK',
  MID_PEAK = 'MID_PEAK',
}

export enum VoltageUnitEnum {
  VOLT = 'V',
  KILOVOLT = 'kV',
}

export enum DeviceLabel {
  MAIN = 'MAIN',
  SUB = 'SUB',
}

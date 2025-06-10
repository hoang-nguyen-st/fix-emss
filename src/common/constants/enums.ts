export enum StatusEnum {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  PENDING = 'pending',
  BLOCKED = 'blocked',
}

export enum Order {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum SortEnum {
  ASC = 'ASC',
  DESC = 'DESC',
}

export enum UserRoleEnum {
  ADMIN = 'Admin',
  USER = 'User',
  SUPER_ADMIN = 'Super Admin',
}

export enum InvoiceStatus {
  PENDING = 'pending',
  PAID = 'paid',
  CANCELLED = 'cancelled',
}

export enum TimeSlotName {
  PEAK = 'peak',
  OFF_PEAK = 'off_peak',
  MID_PEAK = 'mid_peak',
}

export enum DayType {
  WEEKEND = 'weekend',
  WEEKDAY = 'weekday',
}

export enum ProjectType {
  RESIDENTIAL = 'residential',
  BUSINESS = 'business',
  PRODUCTION = 'production',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ZoneStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum ResourceType {
  ELECTRIC = 'electric',
  WATER = 'water',
  GAS = 'gas',
}

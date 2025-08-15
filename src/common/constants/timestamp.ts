export enum TimestampEnum {
  BY_DAY = 'BY_DAY',
  BY_WEEK = 'BY_WEEK',
  BY_MONTH = 'BY_MONTH',
  BY_QUARTER = 'BY_QUARTER',
}

export const TIME_INTERVALS = {
  BY_DAY: {
    key: TimestampEnum.BY_DAY,
    value: 1000 * 60 * 60,
    timestamp: 1000 * 60 * 60 * 25,
    label: 'By Day',
    description: 'One day interval',
  },
  BY_WEEK: {
    key: TimestampEnum.BY_WEEK,
    value: 1000 * 60 * 60 * 24,
    timestamp: 1000 * 60 * 60 * 24 * 8,
    label: 'By Week',
    description: 'One week interval',
  },
  BY_MONTH: {
    key: TimestampEnum.BY_MONTH,
    value: 1000 * 60 * 60 * 24,
    timestamp: 1000 * 60 * 60 * 24 * 31,
    label: 'By Month',
    description: 'One month interval',
  },
  BY_QUARTER: {
    key: TimestampEnum.BY_QUARTER,
    value: 1000 * 60 * 60 * 24,
    timestamp: 1000 * 60 * 60 * 24 * 91,
    label: 'By Quarter',
    description: 'One quarter interval',
  },
} as const;

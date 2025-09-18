export interface GetTodayEnergyAnalyticsDto {
  projectId: string;
  sensorId: string;
  interval?: string;
  systemType?: number;
}

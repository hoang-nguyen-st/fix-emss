import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class GetSingleAnalyticChartDto {
  @IsNotEmpty()
  @IsString()
  projectId: string;

  @IsNotEmpty()
  @IsString()
  sensorId: string;

  @IsNotEmpty()
  @IsString()
  interval: string;

  @IsNotEmpty()
  @IsString()
  startTime: string;

  @IsNotEmpty()
  @IsString()
  endTime: string;

  @IsNotEmpty()
  @IsNumber()
  systemType: number;
}

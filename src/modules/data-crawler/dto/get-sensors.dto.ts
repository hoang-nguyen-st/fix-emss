import { IsString, IsNumber } from 'class-validator';
import { Transform } from 'class-transformer';

export class GetSensorsDto {
  @IsString()
  projectId: string;

  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  systemType: number;
}

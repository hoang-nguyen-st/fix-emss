import { Expose, Transform } from 'class-transformer';
import { IsString, IsNumber, IsBoolean } from 'class-validator';

export class AmigoSensorDto {
  @Expose()
  @IsString()
  tenantCode: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  projectId: string;

  @Expose()
  @IsString()
  sensorId: string;

  @Expose()
  @IsString()
  description: string;

  @Expose()
  @IsString()
  location: string;

  @Expose()
  @IsNumber()
  deviceBrand: number;

  @Expose()
  @IsNumber()
  systemType: number;

  @Expose()
  @IsString()
  dataType: string;

  @Expose()
  @IsString()
  brand: string;

  @Expose()
  @IsString()
  sensorModel: string;

  @Expose()
  @IsString()
  devEUI: string;

  @Expose()
  @IsString()
  alias: string;

  @Expose()
  @IsString()
  equipmentName: string;

  @Expose()
  @IsBoolean()
  iot: boolean;
}

export class AmigoApiResponseDto {
  @Expose()
  @Transform(({ value }) => value || [])
  data: AmigoSensorDto[];

  @Expose()
  @IsNumber()
  code: number;

  @Expose()
  @IsBoolean()
  isSuccess: boolean;

  @Expose()
  @IsString()
  message: string;
}

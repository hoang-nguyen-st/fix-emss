import { IsNotEmpty, IsString, IsUUID, IsEnum } from 'class-validator';

export class CreateZoneResourceDto {
  @IsNotEmpty()
  @IsEnum(['electric', 'water', 'gas'])
  resource: string;

  @IsNotEmpty()
  @IsString()
  deviceId: string;

  @IsNotEmpty()
  @IsUUID()
  zoneId: string;
}

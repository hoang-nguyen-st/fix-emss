import { IsBoolean, IsObject, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateZoneResourceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  resourceType: string;

  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsUUID()
  zoneId: string;
}

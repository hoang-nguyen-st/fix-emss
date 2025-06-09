import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class CreateZoneDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}

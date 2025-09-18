import { IsNotEmpty, IsUUID, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CalculateElectricDto {
  @ApiProperty({
    example: '',
  })
  @IsUUID()
  @IsNotEmpty()
  locationDeviceId: string;

  @ApiProperty({
    example: '',
  })
  @IsUUID()
  @IsNotEmpty()
  workspaceId: string;

  @ApiProperty({
    example: '2025-09-01',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  startDate?: string;

  @ApiProperty({
    example: '2025-09-15',
    required: false,
  })
  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export interface TariffResult {
  tierLevel: number;
  kwh: number;
  unitPrice: number;
  amount: number;
}

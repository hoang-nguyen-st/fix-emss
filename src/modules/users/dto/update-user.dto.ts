import { Expose } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  name: string;

  @Expose()
  @IsOptional()
  address: string;

  @Expose()
  @IsOptional()
  dateOfBirth: number;
}

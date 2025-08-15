import { Expose } from 'class-transformer';
import { UserStatusEnum } from '@Constant/enums';
import { IsOptional } from 'class-validator';

export class UpdateUserDto {
  @Expose()
  @IsOptional()
  email: string;

  @Expose()
  @IsOptional()
  name: string;

  @Expose()
  @IsOptional()
  status: UserStatusEnum;

  @Expose()
  @IsOptional()
  phone: string;

  @Expose()
  @IsOptional()
  address: string;

  @Expose()
  @IsOptional()
  dateOfBirth: number;
}

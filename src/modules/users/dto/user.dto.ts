import { UserStatusEnum } from '@Constant/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsPhoneNumber } from 'class-validator';

export class UserDto {
  @Expose()
  id: string;

  @Expose()
  email: string;

  @Expose()
  @IsPhoneNumber('VN')
  @ApiProperty({
    example: '0708063423',
    description: 'User phone number',
  })
  phone: string;

  @Expose()
  @ApiProperty({
    example: 'active',
    description: 'User status',
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @Expose()
  name: string;

  @Expose()
  dateOfBirth: Date;

  @Expose()
  address: string;

  @Expose()
  createdAt: Date;
}

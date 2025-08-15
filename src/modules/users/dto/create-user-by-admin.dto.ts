import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty, IsPhoneNumber, IsString, Validate } from 'class-validator';
import { IsAdultConstraint } from '@app/common/utils/validateUtils';

export class CreateUserByAdminDto {
  @Expose()
  @IsNotEmpty()
  @IsEmail()
  @ApiProperty({ example: 'kiet.vo@stunited.vn' })
  email: string;

  @Expose()
  @IsNotEmpty()
  @IsPhoneNumber('VN')
  @ApiProperty({ example: '0708063423' })
  phone: string;

  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsDateString()
  @Validate(IsAdultConstraint)
  @ApiProperty({ example: '2003-09-11' })
  dateOfBirth: Date;

  @Expose()
  @IsString()
  @ApiProperty({ example: '123 Main St, Ho Chi Minh City, Vietnam' })
  address: string;
}

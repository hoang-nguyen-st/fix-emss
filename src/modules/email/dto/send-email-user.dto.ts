import { Expose } from 'class-transformer';
import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendEmailNewUserDto {
  @Expose()
  @IsNotEmpty()
  name: string;

  @Expose()
  @IsEmail()
  email: string;

  @Expose()
  password: string;

  @Expose()
  @IsNotEmpty()
  token: string;
}

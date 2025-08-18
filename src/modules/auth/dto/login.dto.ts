import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'admin@stunited.vn' })
  email: string;

  @ApiProperty({ example: 'Admin@123' })
  password: string;
}

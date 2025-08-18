import { ApiProperty } from '@nestjs/swagger';

export class CredentialsDto {
  @ApiProperty({ example: 'kiet.vo@stunited.vn' })
  email: string;

  @ApiProperty({ example: '123456' })
  password: string;
}

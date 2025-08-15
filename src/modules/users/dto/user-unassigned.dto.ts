import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { UserDto } from './user.dto';

export class UserUnAssignedDto extends UserDto {
  @Expose()
  @ApiProperty({
    example: false,
    description: 'User unassigned status (true if user has no location)',
  })
  unAssigned: boolean;
}

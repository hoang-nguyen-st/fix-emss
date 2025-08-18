import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';
import { WorkspaceDto } from './workspace.dto';

export class UserUnAssignedDto extends WorkspaceDto {
  @Expose()
  @ApiProperty({
    example: false,
    description: 'User unassigned status (true if user has no location)',
  })
  unAssigned: boolean;
}

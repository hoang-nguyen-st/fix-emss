import { IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '@app/common/dtos';

export class GetWorkspacesDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  name: string;
}

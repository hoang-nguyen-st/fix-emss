import { PageOptionsDto } from '@app/common/dtos';
import { IsOptional, IsString } from 'class-validator';

export class GetWorkspacesDto extends PageOptionsDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  fromDate?: string;

  @IsOptional()
  @IsString()
  toDate?: string;
}

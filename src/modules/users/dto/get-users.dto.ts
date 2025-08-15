import { IsEnum, IsOptional, IsString } from 'class-validator';
import { PageOptionsDto } from '@app/common/dtos';
import { UserStatusEnum } from '@Constant/enums';

export class GetUsersDto extends PageOptionsDto {
  @IsOptional()
  @IsEnum(UserStatusEnum)
  status;

  @IsOptional()
  @IsString()
  startDate: string;

  @IsOptional()
  @IsString()
  endDate: string;
}

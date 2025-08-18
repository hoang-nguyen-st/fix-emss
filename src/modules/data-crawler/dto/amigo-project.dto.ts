import { Expose, Type } from 'class-transformer';
import { IsString, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class AmigoProjectPermissionDto {
  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsString()
  code: string;

  @Expose()
  @IsNumber()
  type: number;

  @Expose()
  @IsString()
  typeDesc: string;
}

export class AmigoProjectRoleDto {
  @Expose()
  @IsString()
  projectId: string;

  @Expose()
  @IsString()
  projectName: string;

  @Expose()
  @IsString()
  roleId: string;

  @Expose()
  @IsString()
  roleName: string;

  @Expose()
  @IsBoolean()
  isAdmin: boolean;

  @Expose()
  @IsOptional()
  permissions: any;
}

export class AmigoProjectRelationDto {
  @Expose()
  @IsString()
  projectId: string;

  @Expose()
  @IsString()
  projectName: string;

  @Expose()
  @IsBoolean()
  isJoin: boolean;
}

export class AmigoProjectDto {
  @Expose()
  @IsString()
  id: string;

  @Expose()
  @IsString()
  name: string;

  @Expose()
  @IsNumber()
  type: number;

  @Expose()
  @IsString()
  typeDesc: string;

  @Expose()
  @IsOptional()
  @IsString()
  projectPhoto: string;

  @Expose()
  @IsOptional()
  @IsString()
  description: string;

  @Expose()
  @IsOptional()
  @IsString()
  address: string;

  @Expose()
  @IsOptional()
  @IsNumber()
  longitude: number;

  @Expose()
  @IsOptional()
  @IsNumber()
  latitude: number;

  @Expose()
  @IsString()
  createUserId: string;

  @Expose()
  @IsString()
  createUserName: string;

  @Expose()
  @IsOptional()
  @IsString()
  superAdminUserNickName: string;

  @Expose()
  @IsString()
  creationTime: string;

  @Expose()
  @IsOptional()
  @IsString()
  projectModelAddress: string;

  @Expose()
  @IsNumber()
  progress: number;

  @Expose()
  @IsBoolean()
  progressDisplay: boolean;

  @Expose()
  @IsString()
  country: string;

  @Expose()
  @IsString()
  province: string;

  @Expose()
  @IsString()
  city: string;

  @Expose()
  @IsNumber()
  sort: number;

  @Expose()
  @IsOptional()
  @IsString()
  homepageName: string;

  @Expose()
  @IsOptional()
  @IsString()
  homepageLink: string;

  @Expose()
  @IsOptional()
  @IsString()
  homepageUpdateTime: string;

  @Expose()
  @IsOptional()
  @IsString()
  homepageOperator: string;

  @Expose()
  @IsOptional()
  @IsBoolean()
  homepageIsOpen: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  homepageImage: string;

  @Expose()
  @IsString()
  area: string;

  @Expose()
  @IsString()
  background: string;

  @Expose()
  @IsOptional()
  @IsString()
  milestoneDate: string;

  @Expose()
  @IsBoolean()
  isTest: boolean;

  @Expose()
  @IsNumber()
  alarmDeviceCount: number;

  @Expose()
  @Type(() => AmigoProjectRoleDto)
  projectRoleDto: AmigoProjectRoleDto;

  @Expose()
  @IsArray()
  @Type(() => AmigoProjectPermissionDto)
  permissions: AmigoProjectPermissionDto[];

  @Expose()
  @IsArray()
  @Type(() => AmigoProjectRelationDto)
  projectRelation: AmigoProjectRelationDto[];
}

export class AmigoProjectPageDataDto {
  @Expose()
  @IsNumber()
  pageIndex: number;

  @Expose()
  @IsNumber()
  pageSize: number;

  @Expose()
  @IsNumber()
  count: number;

  @Expose()
  @IsArray()
  @Type(() => AmigoProjectDto)
  data: AmigoProjectDto[];
}

export class AmigoProjectApiResponseDto {
  @Expose()
  @IsBoolean()
  isSuccess: boolean;

  @Expose()
  @IsOptional()
  @IsString()
  message: string;

  @Expose()
  @Type(() => AmigoProjectPageDataDto)
  data: AmigoProjectPageDataDto;
}

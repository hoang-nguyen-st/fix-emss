import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateZoneDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  status: string;

  @IsNotEmpty()
  @IsUUID()
  projectId: string;
}

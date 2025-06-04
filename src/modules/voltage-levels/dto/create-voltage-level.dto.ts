import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateVoltageLevelDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  consumtion: number;
}

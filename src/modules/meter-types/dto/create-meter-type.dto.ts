import { IsNotEmpty, IsString, IsInt } from 'class-validator';

export class CreateMeterTypeDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  consumtion: number;
}

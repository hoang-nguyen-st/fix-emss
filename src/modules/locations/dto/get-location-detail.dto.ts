import { LocationDto } from './location.dto';
import { Expose } from 'class-transformer';

export class GetLocationDetailDto extends LocationDto {
  @Expose()
  createdAt: Date;
}

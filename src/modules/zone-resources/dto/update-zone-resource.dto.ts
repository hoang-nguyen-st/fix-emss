import { PartialType } from '@nestjs/mapped-types';
import { CreateZoneResourceDto } from './create-zone-resource.dto';

export class UpdateZoneResourceDto extends PartialType(CreateZoneResourceDto) {}

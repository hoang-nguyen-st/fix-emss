import { DeviceEntity } from '@app/modules/devices/entities';
import { LocationTypeEntity } from '@app/modules/location-types/entities';
import { PriceTypeEntity } from '@app/modules/price-types/entities';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { LocationStatusEnum } from '@Constant/enums';
import { UserEntity } from '@UsersModule/entities/user.entity';
import { Expose } from 'class-transformer';

export class LocationDto {
  @Expose()
  id: string;

  @Expose()
  name: string;

  @Expose()
  status: LocationStatusEnum;

  @Expose()
  locationType: LocationTypeEntity;

  @Expose()
  workspace: WorkspaceEntity;

  @Expose()
  user: UserEntity;

  @Expose()
  priceType: PriceTypeEntity;

  @Expose()
  devices: DeviceEntity[];
}

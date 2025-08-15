import { DetailTelemetryDeviceInterface } from '@app/modules/devices/interface/detail-telemetry-device.interface';
import { LocationTypeEntity } from '@app/modules/location-types/entities';
import { PriceTypeEntity } from '@app/modules/price-types/entities';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { LocationStatusEnum } from '@app/common/constants/enums';
import { UserEntity } from '@app/modules/users/entities/user.entity';
import { Expose } from 'class-transformer';

export class LocationDeviceDetailDto {
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
  devices?: DetailTelemetryDeviceInterface[];
}

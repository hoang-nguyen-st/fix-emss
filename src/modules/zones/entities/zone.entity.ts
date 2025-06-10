import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { UserEntity } from '@UsersModule/entities';
import { ZoneResourceEntity } from '@app/modules/zone-resources/entities/zone-resource.entity';
import { ZoneStatus } from '@Constant/enums';
import { ZONE_CONSTANTS } from '@Constant/zone';

@Entity('zones')
export class ZoneEntity extends AbstractEntity {
  @Column({ type: 'varchar', default: ZONE_CONSTANTS.DEFAULT_NAME_ZONE })
  name: string;

  @Column({ type: 'enum', enum: ZoneStatus, default: ZoneStatus.INACTIVE })
  status: ZoneStatus;

  @ManyToOne(() => ProjectEntity, (project) => project.zones)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, (user) => user.zones)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ZoneResourceEntity, (resource) => resource.zone)
  zoneResources: ZoneResourceEntity[];
}

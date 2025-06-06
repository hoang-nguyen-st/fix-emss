import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { ZoneEntity } from '@app/modules/zones/entities/zone.entity';
import { ProjectStatus, ProjectType } from '@Constant/enums';
import { ProjectUserEntity } from '../../project-users/entities/project-users.entity';

@Entity('projects')
export class ProjectEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: ProjectType, default: ProjectType.BUSINESS })
  projectType: ProjectType;

  @Column({ type: 'enum', enum: ProjectStatus, default: ProjectStatus.ACTIVE })
  status: ProjectStatus;

  @OneToMany(() => ProjectUserEntity, (pu) => pu.project)
  projectUsers: ProjectUserEntity[];

  @OneToMany(() => ZoneEntity, (zone) => zone.project, { nullable: true })
  zones: ZoneEntity[];
}

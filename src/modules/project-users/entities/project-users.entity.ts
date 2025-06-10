import { Entity, Column, ManyToOne } from 'typeorm';
import { UserEntity } from '@UsersModule/entities';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { UserRoleEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';

@Entity('project_users')
export class ProjectUserEntity extends AbstractEntity {
  @Column({ type: 'enum', enum: UserRoleEnum, default: UserRoleEnum.USER })
  role: UserRoleEnum;

  @ManyToOne(() => UserEntity, (user) => user.projectUsers)
  user: UserEntity;

  @ManyToOne(() => ProjectEntity, (project) => project.projectUsers)
  project: ProjectEntity;
}

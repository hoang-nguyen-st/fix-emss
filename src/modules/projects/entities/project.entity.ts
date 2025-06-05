import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { UserEntity } from '@UsersModule/entities';
import { ZoneEntity } from '@app/modules/zones/entities/zone.entity';

export enum ProjectType {
  RESIDENTIAL = 'residential',
  BUSINESS = 'business',
  PRODUCTION = 'production',
}

export enum ProjectStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('projects')
export class ProjectEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: ProjectType })
  projectType: ProjectType;

  @Column({ type: 'enum', enum: ProjectStatus })
  status: ProjectStatus;

  @ManyToOne(() => UserEntity, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ZoneEntity, (zone) => zone.project)
  zones: ZoneEntity[];
}

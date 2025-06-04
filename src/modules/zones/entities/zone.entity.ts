import { Entity, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { ProjectEntity } from '../../projects/entities/project.entity';
import { ZoneResourceEntity } from './zone-resource.entity';
import { UserEntity } from '@UsersModule/entities';

@Entity('zones')
export class ZoneEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(() => ProjectEntity, (project) => project.zones)
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @OneToMany(() => ZoneResourceEntity, (resource) => resource.zone)
  resources: ZoneResourceEntity[];

  @ManyToOne(() => UserEntity, (user) => user.zones)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

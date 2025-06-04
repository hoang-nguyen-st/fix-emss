import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { UserEntity } from '@UsersModule/entities';
import { ZoneEntity } from '@app/modules/zones/entities/zone.entity';

@Entity('projects')
export class ProjectEntity extends AbstractEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'enum', enum: ['kinh_doanh', 'san_xuat'] })
  projectType: string;

  @Column({ type: 'varchar' })
  status: string;

  @ManyToOne(() => UserEntity, (user) => user.projects)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;

  @OneToMany(() => ZoneEntity, (zone) => zone.project)
  zones: ZoneEntity[];
}

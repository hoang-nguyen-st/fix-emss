import * as bcrypt from 'bcrypt';
import { Exclude } from 'class-transformer';
import { BeforeInsert, Column, Entity, OneToMany, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { StatusEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';
import { ProjectEntity } from '@app/modules/projects/entities/project.entity';
import { ZoneEntity } from '@app/modules/zones/entities/zone.entity';

@Entity('users')
@Unique('UQ_users_email_deletedAt', ['email', 'deletedAt'])
@Unique('UQ_users_phone_deletedAt', ['phone', 'deletedAt'])
@Unique('UQ_users_identityId_deletedAt', ['identityId', 'deletedAt'])
export class UserEntity extends AbstractEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 255 })
  email: string;

  @Column({ type: 'varchar', length: 10 })
  phone: string;

  @Column({ type: 'varchar' })
  @Exclude()
  password: string;

  @Column({ type: 'enum', enum: StatusEnum, default: StatusEnum.ACTIVE })
  status: StatusEnum;

  @Column({ type: 'varchar', length: 50 })
  name: string;

  @Column({ type: 'timestamp', nullable: true })
  dateOfBirth: Date;

  @Column({ type: 'varchar', nullable: true, length: 200 })
  address: string;

  @Column({ type: 'varchar', length: 12 })
  identityId: string;

  @Column({ type: 'varchar', nullable: true })
  @Exclude()
  refreshToken: string;

  @BeforeInsert()
  async hasPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @OneToMany(() => ProjectEntity, (project) => project.user)
  projects: ProjectEntity[];

  @OneToMany(() => ZoneEntity, (zone) => zone.user)
  zones: ZoneEntity[];
}

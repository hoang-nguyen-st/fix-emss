import * as bcrypt from 'bcrypt';
import { Exclude, Expose } from 'class-transformer';
import { BeforeInsert, Column, Entity, OneToMany, Unique, BeforeUpdate } from 'typeorm';

import { UserRoleEnum, UserStatusEnum } from '@Constant/enums';
import { AbstractEntity } from '@Entity/abstract.entity';
import { WorkspaceUserEntity } from '@app/modules/workspace-user/entities/workspace-user.entity';

@Entity('users')
@Unique('UQ_users_email_deletedAt', ['email', 'deletedAt'])
export class UserEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', length: 255, name: 'email', unique: true })
  email: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, name: 'phone', unique: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true, name: 'password' })
  @Exclude()
  password: string;

  @Expose()
  @Column({ type: 'enum', enum: UserRoleEnum, name: 'role' })
  role: UserRoleEnum;

  @Expose()
  @Column({ type: 'enum', enum: UserStatusEnum, default: UserStatusEnum.ACTIVE, name: 'status' })
  status: UserStatusEnum;

  @Expose()
  @Column({ type: 'varchar', length: 50, name: 'name' })
  name: string;

  @Expose()
  @Column({ type: 'timestamp', nullable: true, name: 'date_of_birth' })
  dateOfBirth: Date;

  @Expose()
  @Column({ type: 'varchar', nullable: true, length: 200, name: 'address' })
  address: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, name: 'refresh_token' })
  @Exclude()
  refreshToken: string;

  @Expose()
  @Column({ type: 'varchar', nullable: true, name: 'avatar' })
  avatar: string;

  @BeforeInsert()
  @BeforeUpdate()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Expose()
  @OneToMany(() => WorkspaceUserEntity, (workspaceUser) => workspaceUser.user)
  workspaceUsers: WorkspaceUserEntity[];
}

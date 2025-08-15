import { Entity, Column, OneToMany } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { WorkspaceUserEntity } from '@app/modules/workspace-user/entities/workspace-user.entity';
import { Expose } from 'class-transformer';

@Entity('workspaces')
export class WorkspaceEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'varchar', name: 'name' })
  name: string;

  @Expose()
  @OneToMany(() => WorkspaceUserEntity, (workspaceUser) => workspaceUser.workspace)
  workspaceUsers: WorkspaceUserEntity[];
}

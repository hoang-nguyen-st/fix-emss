import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { AbstractEntity } from '@Entity/abstract.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { UserEntity } from '@app/modules/users/entities/user.entity';
import { Expose } from 'class-transformer';

@Entity('workspace_users')
export class WorkspaceUserEntity extends AbstractEntity {
  @Expose()
  @Column({ type: 'uuid', name: 'workspace_id' })
  workspaceId: string;

  @Expose()
  @Column({ type: 'uuid', name: 'user_id' })
  userId: string;

  @ManyToOne(() => WorkspaceEntity, (workspace) => workspace.workspaceUsers)
  @JoinColumn({ name: 'workspace_id' })
  workspace: WorkspaceEntity;

  @ManyToOne(() => UserEntity, (user) => user.workspaceUsers)
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}

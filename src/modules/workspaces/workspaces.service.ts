import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspaceExternalData } from '@app/common/interfaces';
import { buildDataMapByAttribute } from '@app/helpers/buildDataMapByAttribute';
import { classifyMapDifferences, persistEntityChanges } from '@app/common/utils';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>
  ) {}

  async findAll(): Promise<WorkspaceEntity[]> {
    return this.workspaceRepository.find();
  }

  async findOne(id: string): Promise<WorkspaceEntity> {
    return this.workspaceRepository.findOneBy({ id });
  }

  async update(id: string, data: Partial<WorkspaceEntity>): Promise<void> {
    await this.workspaceRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.workspaceRepository.delete(id);
  }

  async createOrUpdateWorkspaces(workspaces: WorkspaceExternalData[]): Promise<void> {
    if (workspaces.length === 0) return;

    const workspaceIds = workspaces.map((w) => w.id);
    const existingWorkspaces = await this.workspaceRepository.findBy({ id: In(workspaceIds) });

    const externalMap = buildDataMapByAttribute(workspaces);
    const dbMap = buildDataMapByAttribute(existingWorkspaces);

    const { toAddOrUpdate, toDelete } = await classifyMapDifferences<WorkspaceExternalData, WorkspaceEntity>(
      externalMap,
      dbMap,
      this.isWorkspaceChanged.bind(this),
      this.mapWorkspaceDataToWorkspaceEntity.bind(this),
      this.workspaceRepository.create.bind(this.workspaceRepository)
    );

    await persistEntityChanges(this.workspaceRepository, toAddOrUpdate, toDelete);
  }

  // =============================== UTILS ===============================

  private isWorkspaceChanged(workspace: WorkspaceEntity, external: WorkspaceExternalData): boolean {
    return workspace.name !== external.name;
  }

  private async mapWorkspaceDataToWorkspaceEntity(external: WorkspaceExternalData): Promise<Partial<WorkspaceEntity>> {
    return {
      name: external.name,
    };
  }
}

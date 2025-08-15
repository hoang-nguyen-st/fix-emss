import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';

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
}

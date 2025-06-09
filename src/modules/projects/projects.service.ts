import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { ProjectEntity } from './entities/project.entity';
import { ProjectExternalData } from '@app/common/interfaces';
import { buildDataMapByAttribute } from '@app/helpers/buildDataMapByAttribute';
import { classifyMapDifferences, persistEntityChanges } from '@app/common/utils';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private readonly projectRepository: Repository<ProjectEntity>
  ) {}

  /**
   * Creates or updates projects based on external data
   * @param projects - Array of project data from external source
   */
  async createOrUpdateProjects(projects: ProjectExternalData[]): Promise<void> {
    if (projects.length === 0) return;

    const projectIds = projects.map((p) => p.id);
    const existingProjects = await this.projectRepository.findBy({ id: In(projectIds) });

    const externalMap = buildDataMapByAttribute(projects);
    const dbMap = buildDataMapByAttribute(existingProjects);

    const { toAddOrUpdate, toDelete } = await classifyMapDifferences<ProjectExternalData, ProjectEntity>(
      externalMap,
      dbMap,
      this.isProjectChanged.bind(this),
      this.mapProjectDataToProjectEntity.bind(this),
      this.projectRepository.create.bind(this.projectRepository)
    );

    await persistEntityChanges(this.projectRepository, toAddOrUpdate, toDelete);
  }

  private isProjectChanged(project: ProjectEntity, external: ProjectExternalData): boolean {
    return project.name !== external.name;
  }

  private mapProjectDataToProjectEntity(project: ProjectExternalData): Partial<ProjectEntity> {
    return {
      id: project.id,
      name: project.name,
    };
  }

  async findAll(): Promise<ProjectEntity[]> {
    return this.projectRepository.find();
  }

  async findOne(id: string): Promise<ProjectEntity> {
    return this.projectRepository.findOneBy({ id });
  }

  async update(id: string, data: Partial<ProjectEntity>): Promise<void> {
    await this.projectRepository.update(id, data);
  }

  async remove(id: string): Promise<void> {
    await this.projectRepository.delete(id);
  }
}

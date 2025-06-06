import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUserEntity } from './entities/project-users.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { UserEntity } from '@UsersModule/entities';
import { UserRoleEnum } from '@Constant/enums';
import { AccountData } from '@app/modules/data-crawler/data-crawler.service';
import { buildDataMapById } from '@app/helpers/buildDataMapById';
import { UsersService } from '@UsersModule/users.service';

@Injectable()
export class ProjectUsersService {
  private readonly logger = new Logger(ProjectUsersService.name);

  constructor(
    @InjectRepository(ProjectUserEntity)
    private readonly projectUserRepository: Repository<ProjectUserEntity>,
    private readonly usersService: UsersService
  ) {}

  async syncUsersDataToProject(project: ProjectEntity, externalUsers: AccountData[]): Promise<void> {
    try {
      const externalMap = buildDataMapById<AccountData>(externalUsers);
      const existingMap = await this.getExistingProjectUserMap(project.id);
      const userData = await this.usersService.loadUserFromExternal(externalUsers);
      const userMap = buildDataMapById<UserEntity>(userData);

      const { toInsert, toUpdate, toDelete } = this.diffProjectUsers(externalMap, existingMap, userMap, project);

      await this.persistProjectUserChanges(toInsert, toUpdate, toDelete);
    } catch (error) {
      this.logger.error(`Error adding users to project: ${error.message}`);
      throw error;
    }
  }

  private async getExistingProjectUserMap(projectId: string): Promise<Map<string, ProjectUserEntity>> {
    const existingRelations = await this.projectUserRepository.find({
      where: { project: { id: projectId } },
      relations: ['user'],
    });
    return buildDataMapById<ProjectUserEntity>(existingRelations);
  }

  private diffProjectUsers(
    externalMap: Map<string, AccountData>,
    existingMap: Map<string, ProjectUserEntity>,
    userMap: Map<string, UserEntity>,
    project: ProjectEntity
  ): {
    toInsert: ProjectUserEntity[];
    toUpdate: ProjectUserEntity[];
    toDelete: ProjectUserEntity[];
  } {
    const toInsert: ProjectUserEntity[] = [];
    const toUpdate: ProjectUserEntity[] = [];
    const toDelete: ProjectUserEntity[] = [];

    const handledIds = new Set<string>();

    for (const [userId, account] of externalMap.entries()) {
      const user = userMap.get(userId);
      if (!user) continue;

      const role = this.mapRole(account.roleName);
      const existing = existingMap.get(userId);

      if (!existing) {
        toInsert.push(this.projectUserRepository.create({ project, user, role }));
      } else if (existing.role !== role) {
        existing.role = role;
        toUpdate.push(existing);
      }

      handledIds.add(userId);
    }

    for (const [userId, rel] of existingMap.entries()) {
      if (!handledIds.has(userId)) {
        toDelete.push(rel);
      }
    }

    return { toInsert, toUpdate, toDelete };
  }

  private async persistProjectUserChanges(
    toInsert: ProjectUserEntity[],
    toUpdate: ProjectUserEntity[],
    toDelete: ProjectUserEntity[]
  ): Promise<void> {
    if (toInsert.length) await this.projectUserRepository.save(toInsert);
    if (toUpdate.length) await this.projectUserRepository.save(toUpdate);
    if (toDelete.length) {
      const ids = toDelete.map((r) => r.id);
      await this.projectUserRepository.delete(ids);
    }
  }

  private mapRole(raw: string): UserRoleEnum {
    return Object.values(UserRoleEnum).includes(raw as UserRoleEnum) ? (raw as UserRoleEnum) : UserRoleEnum.USER;
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectUserEntity } from './entities/project-users.entity';
import { ProjectEntity } from '../projects/entities/project.entity';
import { UserEntity } from '@UsersModule/entities';
import { UserRoleEnum } from '@Constant/enums';
import { AccountData } from '@app/modules/data-crawler/data-crawler.service';

@Injectable()
export class ProjectUsersService {
  private readonly logger = new Logger(ProjectUsersService.name);

  constructor(
    @InjectRepository(ProjectUserEntity)
    private readonly projectUserRepository: Repository<ProjectUserEntity>,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async addUsersToProject(project: ProjectEntity, newUsers: AccountData[]): Promise<void> {
    try {
      const projectId = project.id;

      const existingRelations = await this.projectUserRepository.find({
        where: { project: { id: projectId } },
        relations: ['user'],
      });

      const existingMap = new Map(existingRelations.map((rel) => [rel.user.id, rel]));

      const newUserIds = newUsers.map((u) => u.id);
      const userEntities = await this.userRepository.findByIds(newUserIds);
      const userMap = new Map(userEntities.map((u) => [u.id, u]));

      const toInsert: ProjectUserEntity[] = [];
      const toUpdate: ProjectUserEntity[] = [];
      const toDelete: ProjectUserEntity[] = [];

      const handledIds = new Set<string>();

      for (const user of newUsers) {
        const role: UserRoleEnum = Object.values(UserRoleEnum).includes(user.roleName as UserRoleEnum)
          ? (user.roleName as UserRoleEnum)
          : UserRoleEnum.USER;

        const userEntity = userMap.get(user.id);
        if (!userEntity) continue;

        const existing = existingMap.get(user.id);
        if (!existing) {
          const newRelation = this.projectUserRepository.create({
            project,
            user: userEntity,
            role,
          });
          toInsert.push(newRelation);
        } else if (existing.role !== role) {
          existing.role = role;
          toUpdate.push(existing);
        }

        handledIds.add(user.id);
      }

      for (const [userId, relation] of existingMap.entries()) {
        if (!handledIds.has(userId)) {
          toDelete.push(relation);
        }
      }

      if (toInsert.length) await this.projectUserRepository.save(toInsert);
      if (toUpdate.length) await this.projectUserRepository.save(toUpdate);
      if (toDelete.length) {
        const deleteIds = toDelete.map((r) => r.id);
        await this.projectUserRepository.delete(deleteIds);
      }
    } catch (error) {
      this.logger.error(`Error adding users to project: ${error.message}`);
      throw error;
    }
  }

  async getProjectUsers(projectId: string): Promise<UserEntity[]> {
    const projectUsers = await this.projectUserRepository.find({
      where: { project: { id: projectId } },
      relations: ['user'],
    });
    return projectUsers.map((pu) => pu.user);
  }

  async getUserProjects(userId: string): Promise<ProjectEntity[]> {
    const projectUsers = await this.projectUserRepository.find({
      where: { user: { id: userId } },
      relations: ['project'],
    });
    return projectUsers.map((pu) => pu.project);
  }
}

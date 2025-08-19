import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkspaceEntity } from './entities/workspace.entity';
import { PageMetaDto, ResponsePaginate } from '@app/common/dtos';
import { GetWorkspacesDto } from './dto/get-workspace.dto';
import { WorkspaceDto } from './dto/workspace.dto';

@Injectable()
export class WorkspacesService {
  constructor(
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>
  ) {}

  async findAll(params: GetWorkspacesDto): Promise<ResponsePaginate<WorkspaceDto>> {
    const query = this.workspaceRepository.createQueryBuilder('workspaces');
    if (params.search) {
      query.andWhere('unaccent(LOWER(workspaces.name)) LIKE unaccent(LOWER(:search))', {
        search: `%${params.search}%`,
      });
    }
    query.orderBy(`workspaces.${params.orderBy}`, params.order);
    query.skip(params.skip);
    query.take(params.take);
    const [result, total] = await query.getManyAndCount();
    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });
    return new ResponsePaginate(result, pageMetaDto, 'Thành công', WorkspaceDto);
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

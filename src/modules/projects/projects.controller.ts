import { Controller, Get, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectsService } from './projects.service';
import { ProjectEntity } from './entities/project.entity';

@ApiTags('Projects')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all projects' })
  @ApiResponse({ status: 200, description: 'Return all projects', type: [ProjectEntity] })
  async findAll(): Promise<ProjectEntity[]> {
    return this.projectsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get project by id' })
  @ApiResponse({ status: 200, description: 'Return project by id', type: ProjectEntity })
  async findOne(@Param('id') id: string): Promise<ProjectEntity> {
    return this.projectsService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete project by id' })
  @ApiResponse({ status: 200, description: 'Project deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.projectsService.remove(id);
  }
}

import { Controller, Get, Delete, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WorkspaceEntity } from './entities/workspace.entity';
import { WorkspacesService } from './workspaces.service';

@ApiTags('Workspaces')
@Controller('workspaces')
export class WorkspacesController {
  constructor(private readonly workspacesService: WorkspacesService) {}

  @Get()
  @ApiOperation({ summary: 'Get all workspaces' })
  @ApiResponse({ status: 200, description: 'Return all workspaces', type: [WorkspaceEntity] })
  async findAll(): Promise<WorkspaceEntity[]> {
    return this.workspacesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get workspace by id' })
  @ApiResponse({ status: 200, description: 'Return workspace by id', type: WorkspaceEntity })
  async findOne(@Param('id') id: string): Promise<WorkspaceEntity> {
    return this.workspacesService.findOne(id);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete workspace by id' })
  @ApiResponse({ status: 200, description: 'Workspace deleted successfully' })
  async remove(@Param('id') id: string): Promise<void> {
    return this.workspacesService.remove(id);
  }
}

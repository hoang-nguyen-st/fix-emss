import { Controller } from '@nestjs/common';
import { WorkspaceUserService } from './workspace-user.service';

@Controller('workspace-user')
export class WorkspaceUserController {
  constructor(private readonly workspaceUserService: WorkspaceUserService) {}
}

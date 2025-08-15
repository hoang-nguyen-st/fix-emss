import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkspaceUserEntity } from './entities/workspace-user.entity';
import { WorkspaceUserController } from './workspace-user.controller';
import { WorkspaceUserService } from './workspace-user.service';
import { UsersModule } from '@UsersModule/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkspaceUserEntity]), UsersModule],
  controllers: [WorkspaceUserController],
  providers: [WorkspaceUserService],
  exports: [WorkspaceUserService],
})
export class WorkspaceUserModule {}

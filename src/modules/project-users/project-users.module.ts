import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectUsersService } from './project-users.service';
import { ProjectUserEntity } from './entities/project-users.entity';
import { UserEntity } from '@UsersModule/entities';
import { UsersModule } from '@UsersModule/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([ProjectUserEntity, UserEntity]), UsersModule],
  providers: [ProjectUsersService],
  exports: [ProjectUsersService],
})
export class ProjectUsersModule {}

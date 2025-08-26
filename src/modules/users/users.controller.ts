import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { fileOption } from '@app/config/image-multer-config';
import { FileInterceptor } from '@nestjs/platform-express';
import { GetUsersDto } from '@UsersModule/dto/get-users.dto';
import { UpdateUserDto } from '@UsersModule/dto/update-user.dto';
import { UsersService } from '@UsersModule/users.service';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProfileDto } from './dto/profile.dto';
import { UserDto } from './dto/user.dto';
import { RequestCustom } from '@app/common/interfaces/request-custom';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiBearerAuth, ApiBody, ApiCreatedResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { UserUnAssignedDto } from './dto/user-unassigned.dto';
import { UserStatisticsDataDto } from './dto/user-statistics.dto';

@ApiBearerAuth()
@ApiTags('Users')
@Controller('users')
@UseGuards(JwtAccessTokenGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post(':workspaceId')
  @HttpCode(201)
  @ApiCreatedResponse({ type: UserDto })
  @ApiOperation({ summary: 'Create a new user' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: ResponseItem<UserDto>,
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  async create(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() createUserDto: CreateUserByAdminDto
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.create(workspaceId, createUserDto);
  }

  @Patch('reset-password/:id')
  async resetPassword(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseItem<UserDto>> {
    return await this.usersService.resetPassword(id);
  }

  @Post('change-password')
  async changePassword(
    @Req() req: RequestCustom,
    @Body() changePasswordDto: ChangePasswordDto
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.changePassword(req.user.userId, changePasswordDto);
  }

  @Get(':id/all')
  async getUsers(
    @Param('id', ParseUUIDPipe) id: string,
    @Query() getUsersDto: GetUsersDto
  ): Promise<ResponsePaginate<UserUnAssignedDto>> {
    return await this.usersService.getUsers(id, getUsersDto);
  }

  @Get('summarize')
  @ApiOperation({ summary: 'Get user statistics by status' })
  @ApiResponse({
    status: 200,
    description: 'User statistics retrieved successfully',
    type: UserStatisticsDataDto,
  })
  async getUserTypeStats(): Promise<ResponseItem<UserStatisticsDataDto>> {
    return await this.usersService.getUserByType();
  }

  @Get('me')
  async getProfile(@Req() req: RequestCustom): Promise<ResponseItem<ProfileDto>> {
    return await this.usersService.getProfile(req.user.userId);
  }

  @Patch('profile')
  async updateProfile(@Req() req: RequestCustom, @Body() updateUserDto: UpdateUserDto): Promise<ResponseItem<UserDto>> {
    return await this.usersService.updateProfile(req.user.userId, updateUserDto);
  }

  @Delete(':id')
  async deleteUser(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseItem<null>> {
    return await this.usersService.deleteUser(id);
  }

  @Get(':id')
  async getUser(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseItem<UserDto>> {
    return await this.usersService.getUser(id);
  }

  @Post(':workspaceId/:id')
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: ResponseItem<UserDto>,
  })
  async update(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ): Promise<ResponseItem<UserDto>> {
    return await this.usersService.update(workspaceId, id, updateUserDto);
  }

  @Post('avatar/:identityId')
  @UseInterceptors(FileInterceptor('avatar', fileOption('users')))
  async uploadAvatar(
    @Param('identityId') identityId: string,
    @UploadedFile()
    avatar: Express.Multer.File
  ): Promise<any> {
    if (avatar) {
      return await this.usersService.uploadAvatar(identityId, avatar);
    }
    throw new BadRequestException('Hình ảnh không hợp lệ');
  }

  @Patch('avatar/:identityId')
  async removeAvatar(@Param('identityId') identityId: string): Promise<ResponseItem<UserDto>> {
    return await this.usersService.removeAvatar(identityId);
  }
}

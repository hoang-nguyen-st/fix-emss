import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { plainToClass } from 'class-transformer';
import * as fs from 'fs';
import { Repository } from 'typeorm';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { convertPath, generateRandomPassword, getRandomNumber } from '@app/common/utils';
import { UserRoleEnum, UserStatusEnum } from '@Constant/enums';
import { ConfigService } from '@nestjs/config';
import { GetUsersDto } from '@UsersModule/dto/get-users.dto';
import { UpdateUserDto } from '@UsersModule/dto/update-user.dto';
import { UserEntity } from '@UsersModule/entities/user.entity';
import { ChangePasswordDto } from './dto/change-password.dto';
import { ProfileDto } from './dto/profile.dto';
import { UserDto } from './dto/user.dto';
import { avtPathName, baseImageUrl } from '@Constant/url';
import { EmailService } from '../email/email.service';
import { TokenService } from '../auth/services/token.service';
import { CreateUserByAdminDto } from './dto/create-user-by-admin.dto';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { UserUnAssignedDto } from './dto/user-unassigned.dto';
import { UserStatisticsDataDto, UserStatusStatisticsDto } from './dto/user-statistics.dto';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { WorkspaceUserEntity } from '@app/modules/workspace-user/entities/workspace-user.entity';

@Injectable()
export class UsersService {
  constructor(
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
    private readonly tokenService: TokenService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(LocationEntity)
    private readonly locationRepository: Repository<LocationEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(WorkspaceUserEntity)
    private readonly workspaceUserRepository: Repository<WorkspaceUserEntity>
  ) {}

  async create(workspaceId: string, params: CreateUserByAdminDto): Promise<ResponseItem<UserDto>> {
    const workspace = await this.workspaceRepository.findOneBy({ id: workspaceId, deletedAt: null });
    if (!workspace) throw new BadRequestException('Workspace không tồn tại');

    const emailExisted = await this.userRepository.findOneBy({
      email: params.email,
      deletedAt: null,
    });
    if (emailExisted) throw new BadRequestException('Email đã tồn tại');

    const existPhone = await this.userRepository.findOneBy({
      phone: params.phone,
      deletedAt: null,
    });
    if (existPhone) throw new BadRequestException('Số điện thoại đã tồn tại');

    const passwordLength = getRandomNumber(8, 10);
    const password = generateRandomPassword(passwordLength);
    const userDto = { ...params, password, status: UserStatusEnum.INACTIVE, role: UserRoleEnum.USER };
    const userParams = this.userRepository.create(userDto);
    const user = await this.userRepository.save(userParams);

    await this.workspaceUserRepository.save({
      workspaceId,
      userId: user.id,
    });

    const activationToken = this.tokenService.generateActivationToken(user.id);

    const sendEmailNewUserDto = {
      name: user.name,
      email: user.email,
      password,
      token: activationToken,
    };
    await this.emailService.sendActivationEmail(sendEmailNewUserDto);

    return new ResponseItem(user, 'Tạo mới người dùng thành công', UserDto);
  }

  async resetPassword(id: string): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }
    const newPassword = await bcrypt.hash(this.configService.get<string>('RESET_PASSWORD'), 10);

    await this.userRepository.update(id, {
      ...user,
      password: newPassword,
    });

    const response = await this.userRepository.findOneBy({ id, deletedAt: null });

    const result = {
      ...response,
      password: this.configService.get<string>('RESET_PASSWORD'),
    };

    return new ResponseItem(result, 'Đặt lại mật khẩu thành công');
  }

  async changePassword(id: string, data: ChangePasswordDto): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user || !bcrypt.compareSync(data.oldPassword, user.password)) {
      throw new BadRequestException('Mật khẩu cũ không chính xác');
    }

    const password = await bcrypt.hash(data.newPassword, 10);
    await this.userRepository.update(id, { password });

    return new ResponseItem(user, 'Thay đổi mật khẩu thành công');
  }

  async getUsers(params: GetUsersDto): Promise<ResponsePaginate<UserUnAssignedDto>> {
    const query = this.userRepository.createQueryBuilder('users');
    if (params.status) {
      query.where('users.status = ANY(:status)', {
        status: [params.status],
      });
    }
    if (params.startDate) {
      const startDate = params.startDate.length <= 10 ? params.startDate + ' 00:00:00' : params.startDate;
      query.andWhere('users.createdAt >= :startDate', { startDate });
    }
    if (params.endDate) {
      const endDate = params.endDate.length <= 10 ? params.endDate + ' 23:59:59' : params.endDate;
      query.andWhere('users.createdAt <= :endDate', { endDate });
    }
    if (params.search) {
      query.andWhere('unaccent(LOWER(users.name)) LIKE unaccent(LOWER(:name))', {
        name: `%${params.search ?? ''}%`,
      });
    }
    query.orderBy(`users.${params.orderBy}`, params.order);
    query.skip(params.skip);
    query.take(params.take);

    const [result, total] = await query.getManyAndCount();

    const usersWithUnsignedStatus = await Promise.all(
      result.map(async (user) => {
        const userHasLocation = await this.checkUserHasLocation(user.id);
        return {
          ...user,
          unAssigned: !userHasLocation,
        };
      })
    );

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(usersWithUnsignedStatus, pageMetaDto, 'Thành công', UserUnAssignedDto);
  }

  async getUserByType(): Promise<ResponseItem<UserStatisticsDataDto>> {
    const totalUsers = await this.getTotalUsersCount();
    const userStatsByStatus = await this.getUserStatsByStatus();
    const unassignedUsersCount = await this.getUnassignedUsersCount();

    const data = this.buildUserStatisticsData(userStatsByStatus, unassignedUsersCount);

    return new ResponseItem({ data, total: totalUsers }, 'Thành công', UserStatisticsDataDto);
  }

  private async getTotalUsersCount(): Promise<number> {
    return await this.userRepository.count({
      where: { deletedAt: null },
    });
  }

  private async getUserStatsByStatus(): Promise<UserStatusStatisticsDto[]> {
    return await this.userRepository
      .createQueryBuilder('user')
      .select('user.status', 'status')
      .addSelect('COUNT(user.id)', 'count')
      .where('user.deletedAt IS NULL')
      .groupBy('user.status')
      .getRawMany();
  }

  private async getUnassignedUsersCount(): Promise<number> {
    return await this.userRepository
      .createQueryBuilder('user')
      .where('user.deletedAt IS NULL')
      .andWhere((qb) => {
        const subQuery = qb
          .subQuery()
          .select('1')
          .from('locations', 'location')
          .where('location.user_id = user.id')
          .getQuery();
        return 'NOT EXISTS ' + subQuery;
      })
      .getCount();
  }

  private buildUserStatisticsData(
    userStatsByStatus: UserStatusStatisticsDto[],
    unassignedUsersCount: number
  ): UserStatusStatisticsDto[] {
    const data: UserStatusStatisticsDto[] = userStatsByStatus.map((stat) => ({
      status: stat.status,
      count: Number(stat.count),
    }));

    if (unassignedUsersCount > 0) {
      data.push({ status: UserStatusEnum.UNASSIGNED, count: unassignedUsersCount });
    }

    return data;
  }

  async getUser(id: string): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOne({
      where: {
        id,
      },
    });
    if (!user) throw new BadRequestException('Nhân viên không tồn tại');

    return new ResponseItem(
      { ...user, avatar: user.avatar ? baseImageUrl + convertPath(user.avatar) : null },
      'Thành công'
    );
  }

  async getProfile(id: string): Promise<ResponseItem<ProfileDto>> {
    const user = await this.userRepository.findOne({
      where: { id },
    });

    const result = plainToClass(ProfileDto, { ...user }, { excludeExtraneousValues: true });

    return new ResponseItem(result, 'Thành công');
  }

  async updateProfile(id: string, updateUserDto: UpdateUserDto): Promise<ResponseItem<UserDto>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) {
      throw new BadRequestException('Thông tin cá nhân không tồn tại');
    }

    const allowed = plainToClass(UpdateUserDto, updateUserDto, { excludeExtraneousValues: true });
    await this.userRepository.update(id, {
      ...user,
      name: allowed.name ?? user.name,
      address: allowed.address ?? user.address,
      dateOfBirth: allowed.dateOfBirth ?? user.dateOfBirth,
    });

    const result = await this.userRepository.findOneBy({ id, deletedAt: null });

    return new ResponseItem(result, 'Cập nhật dữ liệu thành công');
  }

  async update(workspaceId: string, id: string, updateUserDto: UpdateUserDto): Promise<ResponseItem<UserDto>> {
    const workspace = await this.workspaceRepository.findOneBy({ id: workspaceId, deletedAt: null });
    if (!workspace) throw new BadRequestException('Workspace không tồn tại');

    const belongsToWorkspace = await this.workspaceUserRepository.findOneBy({ workspaceId, userId: id });
    if (!belongsToWorkspace) throw new BadRequestException('Người dùng không thuộc workspace này');
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) {
      throw new BadRequestException('Người dùng không tồn tại');
    }

    const allowed = plainToClass(UpdateUserDto, updateUserDto, { excludeExtraneousValues: true });
    await this.userRepository.update(id, {
      ...user,
      name: allowed.name ?? user.name,
      address: allowed.address ?? user.address,
      dateOfBirth: allowed.dateOfBirth ?? user.dateOfBirth,
    });

    const result = await this.userRepository.findOneBy({ id, deletedAt: null });

    return new ResponseItem(result, 'Cập nhật dữ liệu thành công');
  }

  async deleteUser(id: string): Promise<ResponseItem<null>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    if (user.status === UserStatusEnum.ACTIVE) throw new BadRequestException('Không được xóa nhân viên đang hoạt động');

    await this.userRepository.softDelete(id);

    return new ResponseItem(null, 'Xóa nhân viên thành công');
  }

  async uploadAvatar(id: string, file: Express.Multer.File): Promise<ResponseItem<any>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });

    if (!user) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }

    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        avatar: avtPathName('users', file.filename),
      })
      .where('id = :id', { id })
      .execute();

    if (fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    return new ResponseItem(null, 'Cập nhật thông tin thành công');
  }

  async removeAvatar(id: string): Promise<ResponseItem<any>> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });

    if (!user) {
      throw new BadRequestException('Nhân viên không tồn tại');
    }

    await this.userRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        avatar: null,
      })
      .where('id = :id', { id })
      .execute();

    if (fs.existsSync(user.avatar)) {
      fs.unlinkSync(user.avatar);
    }

    return new ResponseItem(null, 'Xóa ảnh đại diện thành công');
  }

  async getUserEntityById(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    return user;
  }

  async findOne(id: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({ id, deletedAt: null });
    if (!user) throw new BadRequestException('Người dùng không tồn tại');
    return user;
  }

  /**
   * Kiểm tra xem user có location hay không
   * @param userId - ID của user cần kiểm tra
   * @returns true nếu user có location, false nếu không có
   */
  private async checkUserHasLocation(userId: string): Promise<boolean> {
    return await this.locationRepository
      .createQueryBuilder('location')
      .where('location.user.id = :userId', { userId })
      .getExists();
  }
}

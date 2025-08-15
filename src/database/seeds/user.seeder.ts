import { Seeder } from 'nestjs-seeder';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@app/modules/users/entities/user.entity';
import { UserStatusEnum, UserRoleEnum } from '@Constant/enums';

export class UserSeeder implements Seeder {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>
  ) {}

  async seed(): Promise<any> {
    try {
      const userDatas = [
        {
          email: 'superAdmin@stunited.vn',
          phone: '0909090909',
          password: 'SuperAdmin@123',
          status: UserStatusEnum.ACTIVE,
          name: 'Super Admin',
          dateOfBirth: new Date('2000-01-01'),
          address: 'Hanoi',
          role: UserRoleEnum.SUPER_ADMIN,
          refreshToken: null,
          avatar: null,
        },
        {
          email: 'admin@stunited.vn',
          phone: '0123456789',
          password: 'Admin@123',
          status: UserStatusEnum.ACTIVE,
          name: 'Admin',
          dateOfBirth: new Date('2000-01-01'),
          address: 'Hanoi',
          role: UserRoleEnum.ADMIN,
          refreshToken: null,
          avatar: null,
        },
        {
          email: 'user@stunited.vn',
          phone: '0123456799',
          password: 'User@123',
          status: UserStatusEnum.ACTIVE,
          name: 'User',
          dateOfBirth: new Date('2000-01-01'),
          address: 'Hanoi',
          refreshToken: null,
          avatar: null,
          role: UserRoleEnum.USER,
        },
        {
          email: 'hoang.nguyen@stunited.vn',
          phone: '0708063423',
          password: 'Spiderman2099',
          status: UserStatusEnum.ACTIVE,
          name: 'Hoang Nguyen',
          dateOfBirth: new Date('2004-01-07'),
          address: 'Da Nang',
          refreshToken: null,
          avatar: null,
          role: UserRoleEnum.USER,
        },
        {
          email: 'ngocanh.pham@stunited.vn',
          phone: '0909090907',
          password: 'User@123',
          status: UserStatusEnum.ACTIVE,
          name: 'Ngoc Canh Pham',
          dateOfBirth: new Date('2003-01-01'),
          address: 'Da Nang',
          refreshToken: null,
          avatar: null,
          role: UserRoleEnum.USER,
        },
        {
          email: 'vannhat.nguyen@stunited.vn',
          phone: '0909090906',
          password: 'User@123',
          status: UserStatusEnum.ACTIVE,
          name: 'Van Nhat Nguyen',
          dateOfBirth: new Date('2004-01-01'),
          address: 'Da Nang',
          refreshToken: null,
          avatar: null,
          role: UserRoleEnum.USER,
        },
      ];

      for (const userData of userDatas) {
        const user = this.userRepository.create(userData);
        await this.userRepository.save(user);
      }
    } catch (error) {
      throw error;
    }
  }

  async drop(): Promise<any> {
    try {
      await this.userRepository.delete({});
    } catch (error) {
      throw error;
    }
  }
}

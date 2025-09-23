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

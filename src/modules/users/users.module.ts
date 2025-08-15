import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { UserEntity } from './entities/user.entity';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { UsersService } from '@UsersModule/users.service';
import { UsersController } from '@UsersModule/users.controller';
import { EmailService } from '../email/email.service';
import { TokenService } from '../auth/services/token.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity, LocationEntity]),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_ACCESS_SECRETKEY'),
        signOptions: { expiresIn: `${configService.get<number>('JWT_ACCESS_EXPIRES')}` },
      }),
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, ConfigService, EmailService, TokenService],
  exports: [UsersService],
})
export class UsersModule {}

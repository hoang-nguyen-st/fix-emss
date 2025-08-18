import * as bcrypt from 'bcrypt';
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '@UsersModule/entities';
import { CredentialsDto } from './dto/credentials.dto';
import { UserStatusEnum } from '@Constant/enums';
import { UserPayloadDto } from './dto/user-payload.dto';
import { JwtPayload } from '@Constant/types';
import { ResponseItem } from '@app/common/dtos';
import { TokenDto } from './dto/token.dto';
import { TokenService } from './services/token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly tokenService: TokenService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>
  ) {}

  async validateUser(credentialsDto: CredentialsDto): Promise<UserPayloadDto> {
    const { email, password } = credentialsDto;

    const user = await this.findUserByEmail(email);

    this.validateUserStatus(user);

    this.validatePassword(password, user.password);

    return this.createUserPayload(user);
  }

  private async findUserByEmail(email: string): Promise<UserEntity> {
    const user = await this.userRepository.findOneBy({
      email,
      status: UserStatusEnum.ACTIVE,
      deletedBy: null,
    });

    if (!user) {
      throw new UnauthorizedException('Tài khoản không tồn tại');
    }

    return user;
  }

  private validateUserStatus(user: UserEntity): void {
    switch (user.status) {
      case UserStatusEnum.PENDING:
        throw new UnauthorizedException('Tài khoản chưa được kích hoạt');
      case UserStatusEnum.BLOCKED:
        throw new UnauthorizedException('Tài khoản đã bị khóa');
      case UserStatusEnum.ACTIVE:
      case UserStatusEnum.INACTIVE:
        return;
      default:
        throw new UnauthorizedException('Tài khoản không tồn tại');
    }
  }

  private validatePassword(inputPassword: string, hashedPassword: string): void {
    const isPasswordValid = bcrypt.compareSync(inputPassword, hashedPassword);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Mật khẩu không đúng');
    }
  }

  private createUserPayload(user: UserEntity): UserPayloadDto {
    return {
      id: user.id,
      email: user.email,
      name: user.name,
    };
  }

  async login(userPayloadDto: UserPayloadDto): Promise<ResponseItem<TokenDto>> {
    const payload: JwtPayload = { sub: userPayloadDto.id, email: userPayloadDto.email };

    const refreshToken = this.tokenService.generateRefreshToken(payload);
    const accessToken = this.tokenService.generateAccessToken(payload);

    await this.userRepository.update(userPayloadDto.id, { refreshToken });

    const data = {
      name: userPayloadDto.name,
      accessToken,
      refreshToken,
    };

    return new ResponseItem(data, 'Đăng nhập thành công');
  }

  async logout(userId: string): Promise<ResponseItem<null>> {
    const logout = await this.userRepository.update(userId, { refreshToken: null });
    if (!logout) {
      throw new BadRequestException('Đăng xuất không thành công');
    }

    return new ResponseItem(null, 'Đăng xuất thành công');
  }

  async refreshToken(token: string): Promise<ResponseItem<TokenDto>> {
    const user = await this.userRepository.findOneBy({
      refreshToken: token,
      status: UserStatusEnum.ACTIVE,
      deletedBy: null,
    });

    if (!user) throw new UnauthorizedException('Tài khoản không đúng');
    const payload: JwtPayload = { sub: user.id, email: user.email };

    const data = {
      accessToken: this.tokenService.generateAccessToken(payload),
    };

    return new ResponseItem(data, 'Làm mới token thành công');
  }

  async activateAccount(token: string): Promise<ResponseItem<null>> {
    try {
      const userId = this.tokenService.verifyActivationToken(token);

      const user = await this.userRepository.findOneBy({ id: userId });
      if (!user) {
        throw new BadRequestException('Người dùng không tồn tại');
      }

      if (user.status === UserStatusEnum.ACTIVE) {
        throw new BadRequestException('Tài khoản đã được kích hoạt trước đó');
      }

      await this.userRepository.update(user.id, { status: UserStatusEnum.ACTIVE });

      return new ResponseItem(null, 'Kích hoạt tài khoản thành công');
    } catch (error) {
      throw new BadRequestException('Mã kích hoạt không hợp lệ hoặc đã hết hạn');
    }
  }
}

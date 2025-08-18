import { ResponseItem } from '@app/common/dtos';
import { Controller, Get, Headers, HttpCode, Post, Query, Req, UseGuards } from '@nestjs/common';

import { AuthService } from './auth.service';
import { TokenDto } from './dto/token.dto';
import { JwtAccessTokenGuard } from './guards/jwt-access-token.guard';
import { JwtRefreshTokenGuard } from './guards/jwt-refresh-token.guard';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @ApiResponse({ type: TokenDto, status: 200, description: 'Login successfully' })
  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @HttpCode(200)
  @Post('login')
  async login(@Req() request): Promise<ResponseItem<TokenDto>> {
    return this.authService.login(request.user);
  }

  @UseGuards(JwtAccessTokenGuard)
  @Get('logout')
  async logout(@Req() request): Promise<ResponseItem<null>> {
    return this.authService.logout(request.user.userId);
  }

  @UseGuards(JwtRefreshTokenGuard)
  @HttpCode(200)
  @Get('refresh')
  async refresh(@Headers('Authorization') auth: string): Promise<ResponseItem<TokenDto>> {
    const token = auth.replace('Bearer ', '');
    return this.authService.refreshToken(token);
  }

  @ApiOperation({ summary: 'Activate User' })
  @ApiResponse({ status: 201, description: 'Activation successful' })
  @ApiResponse({ status: 400, description: 'The activation code is invalid or expired.' })
  @Get('activate')
  async activateAccount(@Query('token') token: string): Promise<ResponseItem<null>> {
    return await this.authService.activateAccount(token);
  }
}

import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@app/modules/auth/guards/jwt-access-token.guard';
import { TariffTiersService } from './tariff-tiers.service';
import { ResponseItem } from '@app/common/dtos';
import { TariffTierEntity } from './entities/tariff-tier.entity';
import { GetTariffTierDto } from './dto/get-tariff-tier.dto';
import { CreateManyTariffTiersDto } from './dto/tariff-tier.dto';

@Controller('tariff-tiers')
@ApiTags('Tariff Tiers')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
export class TariffTiersController {
  constructor(private readonly tariffTiersService: TariffTiersService) {}

  @Get()
  findAll(@Query() params: GetTariffTierDto): Promise<ResponseItem<TariffTierEntity[]>> {
    return this.tariffTiersService.findAll(params);
  }

  @Post('bulk')
  async createMany(@Body() dto: CreateManyTariffTiersDto) {
    return this.tariffTiersService.createMany(dto);
  }
}

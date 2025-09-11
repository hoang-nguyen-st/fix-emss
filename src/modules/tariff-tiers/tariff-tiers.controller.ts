import { Body, Controller, Get, Param, ParseUUIDPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { TariffTiersService } from './tariff-tiers.service';
import { TariffTierEntity } from '@Entity/index';
import { GetTariffTierDto } from './dto/response/get-tariff-tier.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { UpdateTariffTierPriceDto } from './dto/request/update-tariff-tier.dto';
import { ResponseItem } from '@app/common/dtos';
import { CreateManyTariffTiersDto } from './dto/request/tariff-tier.dto';

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
  async createMany(@Body() dto: CreateManyTariffTiersDto): Promise<ResponseItem<TariffTierEntity[]>> {
    return this.tariffTiersService.createMany(dto);
  }

  @Patch('tariff-tier/:tariffTierId')
  @ApiOperation({ summary: 'Update a pricing for TariffTier' })
  @ApiParam({ name: 'tariffTierId', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateTariffTierPriceDto })
  updateTariffTierPrice(
    @Param('tariffTierId', ParseUUIDPipe) tariffTierId: string,
    @Body() body: UpdateTariffTierPriceDto
  ) {
    return this.tariffTiersService.updateTariffTierPrice(tariffTierId, body.unitPrice);
  }
}

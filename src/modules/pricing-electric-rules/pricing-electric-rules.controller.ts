import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { PricingElectricRulesService } from './pricing-electric-rules.service';
import { BulkCreatePricingElectricRulesDto } from './dto/request/create-pricing-electric-rule.dto';
import {
  UpdatePriceByVoltAndPricingListDto,
  UpdateTariffTierPriceDto,
} from './dto/request/update-pricing-electric-rule.dto';
import { ApiTags, ApiOperation, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { ResponseItem } from '@app/common/dtos';
import { PricingElectricRuleEntity, TariffTierEntity } from '@Entity/index';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { MeterTypePricing, PricingTemplateResponseData } from './dto/response/pricing-electric-rule.dto';

@ApiTags('Pricing Electric Rules')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('pricing-electric-rules')
export class PricingElectricRulesController {
  constructor(private readonly pricingElectricRulesService: PricingElectricRulesService) {}

  @Post('bulk-create')
  async bulkCreatePricingElectricRules(
    @Body() bulkCreateDto: BulkCreatePricingElectricRulesDto
  ): Promise<ResponseItem<PricingElectricRuleEntity[]>> {
    return await this.pricingElectricRulesService.bulkCreatePricingElectricRules(bulkCreateDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pricing electric rules' })
  findAll() {
    return this.pricingElectricRulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pricing electric rule by id' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingElectricRulesService.findOne(id);
  }

  @Get('by-location-type/:locationTypeId')
  @ApiOperation({ summary: 'Get pricing rules by location type' })
  @ApiParam({ name: 'locationTypeId', type: 'string' })
  getByLocationTypeTemplate(
    @Param('locationTypeId', ParseUUIDPipe) locationTypeId: string
  ): Promise<ResponseItem<PricingTemplateResponseData>> {
    return this.pricingElectricRulesService.getPricingTemplateByLocationType(locationTypeId);
  }

  @Get(':workspaceId/by-location-type/:locationTypeId')
  @ApiOperation({ summary: 'Get pricing rules by location type' })
  @ApiParam({ name: 'locationTypeId', type: 'string' })
  getByWorkspaceAndLocationType(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Param('locationTypeId', ParseUUIDPipe) locationTypeId: string
  ): Promise<ResponseItem<TariffTierEntity[] | MeterTypePricing>> {
    return this.pricingElectricRulesService.getPricingByLocationType(workspaceId, locationTypeId);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a pricing electric rule' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdatePriceByVoltAndPricingListDto })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePricingElectricRuleDto: UpdatePriceByVoltAndPricingListDto
  ) {
    return this.pricingElectricRulesService.updatePricingRule(id, updatePricingElectricRuleDto);
  }

  @Patch('tariff-tier/:id')
  @ApiOperation({ summary: 'Update a pricing for TariffTier' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiBody({ type: UpdateTariffTierPriceDto })
  updateTariffTierPrice(@Param('id', ParseUUIDPipe) id: string, @Body() body: UpdateTariffTierPriceDto) {
    return this.pricingElectricRulesService.updateTariffTierPrice(id, body.unitPrice);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pricing electric rule' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingElectricRulesService.remove(id);
  }
}

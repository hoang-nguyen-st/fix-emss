import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe } from '@nestjs/common';
import { PricingElectricRulesService } from './pricing-electric-rules.service';
import { CreatePricingElectricRuleDto } from './dto/request/create-pricing-electric-rule.dto';
import { ApiBody, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { UpdatePriceByVoltAndPricingListDto } from './dto/request/update-pricing-electric-rule.dto';

@ApiTags('Pricing Electric Rules')
@Controller('pricing-electric-rules')
export class PricingElectricRulesController {
  constructor(private readonly pricingElectricRulesService: PricingElectricRulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pricing electric rule' })
  @ApiBody({ type: CreatePricingElectricRuleDto })
  create(@Body() createPricingElectricRuleDto: CreatePricingElectricRuleDto) {
    return this.pricingElectricRulesService.create(createPricingElectricRuleDto);
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

  @Get('/by-location-type/:locationTypeId')
  @ApiOperation({ summary: 'Get pricing rules by location type' })
  @ApiParam({ name: 'locationTypeId', type: 'string' })
  getByLocationType(@Param('locationTypeId') locationTypeId: string) {
    return this.pricingElectricRulesService.getPricingByLocationType(locationTypeId);
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

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a pricing electric rule' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pricingElectricRulesService.remove(id);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { PricingElectricRulesService } from './pricing-electric-rules.service';
import { CreatePricingElectricRuleDto } from './dto/create-pricing-electric-rule.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';

@ApiTags('pricing-electric-rules')
@Controller('pricing-electric-rules')
@UseGuards(JwtAccessTokenGuard)
export class PricingElectricRulesController {
  constructor(private readonly pricingElectricRulesService: PricingElectricRulesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new pricing electric rule' })
  @ApiResponse({ status: 201, description: 'Pricing electric rule created successfully' })
  async create(@Body() createPricingElectricRuleDto: CreatePricingElectricRuleDto) {
    return await this.pricingElectricRulesService.create(createPricingElectricRuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all pricing electric rules' })
  @ApiResponse({ status: 200, description: 'Return all pricing electric rules' })
  async findAll() {
    return await this.pricingElectricRulesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a pricing electric rule by id' })
  @ApiResponse({ status: 200, description: 'Return the pricing electric rule' })
  async findOne(@Param('id') id: string) {
    return await this.pricingElectricRulesService.findOne(id);
  }
}

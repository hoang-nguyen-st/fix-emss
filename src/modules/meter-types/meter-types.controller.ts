import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { MeterTypesService } from './meter-types.service';
import { CreateMeterTypeDto } from './dto/create-meter-type.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('meter-types')
@Controller('meter-types')
@UseGuards(JwtAccessTokenGuard)
export class MeterTypesController {
  constructor(private readonly meterTypesService: MeterTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new meter type' })
  @ApiResponse({ status: 201, description: 'Meter type created successfully' })
  async create(@Body() createMeterTypeDto: CreateMeterTypeDto) {
    return await this.meterTypesService.create(createMeterTypeDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all meter types' })
  @ApiResponse({ status: 200, description: 'Return all meter types' })
  async findAll() {
    return await this.meterTypesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a meter type by id' })
  @ApiResponse({ status: 200, description: 'Return the meter type' })
  async findOne(@Param('id') id: string) {
    return await this.meterTypesService.findOne(id);
  }
}

import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { VoltageLevelsService } from './voltage-levels.service';
import { CreateVoltageLevelDto } from './dto/create-voltage-level.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';

@ApiTags('voltage-levels')
@Controller('voltage-levels')
@UseGuards(JwtAccessTokenGuard)
export class VoltageLevelsController {
  constructor(private readonly voltageLevelsService: VoltageLevelsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new voltage level' })
  @ApiResponse({ status: 201, description: 'Voltage level created successfully' })
  async create(@Body() createVoltageLevelDto: CreateVoltageLevelDto) {
    return await this.voltageLevelsService.create(createVoltageLevelDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all voltage levels' })
  @ApiResponse({ status: 200, description: 'Return all voltage levels' })
  async findAll() {
    return await this.voltageLevelsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a voltage level by id' })
  @ApiResponse({ status: 200, description: 'Return the voltage level' })
  async findOne(@Param('id') id: string) {
    return await this.voltageLevelsService.findOne(id);
  }
}

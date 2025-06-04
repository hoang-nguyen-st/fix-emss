import { Controller, Get, Post, Body, Param, UseGuards } from '@nestjs/common';
import { ZonesService } from './zones.service';
import { CreateZoneDto } from './dto/create-zone.dto';
import { CreateZoneResourceDto } from './dto/create-zone-resource.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('zones')
@Controller('zones')
@UseGuards(JwtAccessTokenGuard)
export class ZonesController {
  constructor(private readonly zonesService: ZonesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new zone' })
  @ApiResponse({ status: 201, description: 'Zone created successfully' })
  async create(@Body() createZoneDto: CreateZoneDto) {
    return await this.zonesService.create(createZoneDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all zones' })
  @ApiResponse({ status: 200, description: 'Return all zones' })
  async findAll() {
    return await this.zonesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a zone by id' })
  @ApiResponse({ status: 200, description: 'Return the zone' })
  async findOne(@Param('id') id: string) {
    return await this.zonesService.findOne(id);
  }

  @Post(':id/resources')
  @ApiOperation({ summary: 'Add a resource to a zone' })
  @ApiResponse({ status: 201, description: 'Resource added successfully' })
  async addResource(@Param('id') zoneId: string, @Body() createZoneResourceDto: CreateZoneResourceDto) {
    createZoneResourceDto.zoneId = zoneId;
    return await this.zonesService.createResource(createZoneResourceDto);
  }

  @Get(':id/resources')
  @ApiOperation({ summary: 'Get all resources of a zone' })
  @ApiResponse({ status: 200, description: 'Return all resources of the zone' })
  async getZoneResources(@Param('id') zoneId: string) {
    return await this.zonesService.findZoneResources(zoneId);
  }
}

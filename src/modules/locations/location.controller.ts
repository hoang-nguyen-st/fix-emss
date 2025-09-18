import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@app/modules/auth/guards/jwt-access-token.guard';
import { GetLocationDto } from './dto/get-location.dto';
import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { LocationEntity } from './entities/location.entity';
import { LocationByWorkspaceDto } from './dto/get-location-by-workspace';

@Controller('locations')
@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post('workspace/:workspaceId')
  create(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Body() createLocationDto: CreateLocationDto
  ): Promise<ResponseItem<LocationEntity>> {
    return this.locationsService.create(workspaceId, createLocationDto);
  }

  @Get('workspace/:workspaceId')
  getLocationsByWorkspace(
    @Param('workspaceId', ParseUUIDPipe) workspaceId: string,
    @Query() params: GetLocationDto
  ): Promise<ResponsePaginate<LocationByWorkspaceDto[]>> {
    return this.locationsService.getLocationsByWorkspace(workspaceId, params);
  }

  @Get('workspace/:workspaceId/get-all')
  findAll(@Param('workspaceId', ParseUUIDPipe) workspaceId: string): Promise<LocationEntity[]> {
    return this.locationsService.findAll(workspaceId);
  }

  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ResponseItem<LocationEntity>> {
    return this.locationsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateLocationDto: UpdateLocationDto) {
    return this.locationsService.update(id, updateLocationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.locationsService.remove(id);
  }
}

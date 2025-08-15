import { Controller, Get, Post, Body, Patch, Param, Delete, ParseUUIDPipe, UseGuards, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '@app/modules/auth/guards/jwt-access-token.guard';
import { GetLocationDto } from './dto/get-location.dto';
import { ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { LocationDto } from './dto/location.dto';
import { LocationEntity } from './entities/location.entity';

@Controller('locations')
@ApiTags('Locations')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
export class LocationsController {
  constructor(private readonly locationsService: LocationsService) {}

  @Post()
  create(@Body() createLocationDto: CreateLocationDto): Promise<ResponseItem<LocationEntity>> {
    return this.locationsService.create(createLocationDto);
  }

  @Get('all')
  getAllLocations(@Query() params: GetLocationDto): Promise<ResponsePaginate<LocationDto[]>> {
    return this.locationsService.getAllLocations(params);
  }

  @Get()
  findAll() {
    return this.locationsService.findAll();
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

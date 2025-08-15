import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { LocationTypesService } from './location-types.service';
import { CreateLocationTypeDto } from './dto/request/create-location-type.dto';
import { UpdateLocationTypeDto } from './dto/request/update-location-type.dto';
import { LocationTypeResponseDto } from './dto/response/location-type-response.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ResponseItem } from '@app/common/dtos';
import { LocationTypeNameDto } from './dto/location-type-name.dto';
import { LocationTypeEntity } from './entities/location-type.entity';

@ApiTags('Location Types')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('location-types')
export class LocationTypesController {
  constructor(private readonly locationTypesService: LocationTypesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new location type' })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Location type created successfully',
    type: LocationTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Location type with this name or code already exists',
  })
  async create(@Body() createLocationTypeDto: CreateLocationTypeDto) {
    return await this.locationTypesService.create(createLocationTypeDto);
  }

  @Get('/list-name')
  getLocationTypeNames(): Promise<ResponseItem<LocationTypeNameDto>> {
    return this.locationTypesService.getLocationTypeNames();
  }

  @Get()
  @ApiOperation({ summary: 'Get all location types with pagination and filtering' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location types retrieved successfully',
    type: [LocationTypeResponseDto],
  })
  async findAll(): Promise<ResponseItem<LocationTypeEntity[]>> {
    return await this.locationTypesService.getLocationTypes();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a location type by ID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location type retrieved successfully',
    type: LocationTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Location type not found',
  })
  async findOne(@Param('id') id: string) {
    return await this.locationTypesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a location type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location type updated successfully',
    type: LocationTypeResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Location type not found',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Location type with this name or code already exists',
  })
  async update(@Param('id') id: string, @Body() updateLocationTypeDto: UpdateLocationTypeDto) {
    return await this.locationTypesService.update(id, updateLocationTypeDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a location type' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Location type deleted successfully',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Location type not found',
  })
  async remove(@Param('id') id: string) {
    return await this.locationTypesService.remove(id);
  }
}

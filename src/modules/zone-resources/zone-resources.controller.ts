import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ZoneResourcesService } from './zone-resources.service';
import { CreateZoneResourceDto } from './dto/create-zone-resource.dto';
import { UpdateZoneResourceDto } from './dto/update-zone-resource.dto';

@Controller('zone-resources')
export class ZoneResourcesController {
  constructor(private readonly zoneResourcesService: ZoneResourcesService) {}

  @Post()
  create(@Body() createZoneResourceDto: CreateZoneResourceDto) {
    return this.zoneResourcesService.create(createZoneResourceDto);
  }

  @Get()
  findAll() {
    return this.zoneResourcesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.zoneResourcesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateZoneResourceDto: UpdateZoneResourceDto) {
    return this.zoneResourcesService.update(id, updateZoneResourceDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.zoneResourcesService.remove(id);
  }
}

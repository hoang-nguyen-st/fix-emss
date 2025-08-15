import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PriceTypesService } from './price-types.service';
import { CreatePriceTypeDto } from './dto/create-price-type.dto';
import { UpdatePriceTypeDto } from './dto/update-price-type.dto';
import { JwtAccessTokenGuard } from '@app/modules/auth/guards/jwt-access-token.guard';

@Controller('price-types')
@UseGuards(JwtAccessTokenGuard)
export class PriceTypesController {
  constructor(private readonly priceTypesService: PriceTypesService) {}

  @Post()
  create(@Body() createPriceTypeDto: CreatePriceTypeDto) {
    return this.priceTypesService.create(createPriceTypeDto);
  }

  @Get()
  findAll() {
    return this.priceTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.priceTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updatePriceTypeDto: UpdatePriceTypeDto) {
    return this.priceTypesService.update(id, updatePriceTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.priceTypesService.remove(id);
  }
}

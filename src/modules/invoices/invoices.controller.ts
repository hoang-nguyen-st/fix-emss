import { BadRequestException, Body, Controller, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { InvoicesService } from './invoices.service';
import { CalculateElectricDto } from './dto/request/calculate-electric.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post('calculate')
  async calculateElectric(@Body() dto: CalculateElectricDto) {
    if (dto.endDate && new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new BadRequestException('endDate must be after or equal startDate');
    }
    return await this.invoicesService.calculateElectric(dto);
  }
}

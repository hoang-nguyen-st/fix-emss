import { Controller, Get, Post, Body, Param, UseGuards, Patch } from '@nestjs/common';
import { InvoicesService } from './invoices.service';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('invoices')
@Controller('invoices')
@UseGuards(JwtAccessTokenGuard)
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new invoice' })
  @ApiResponse({ status: 201, description: 'Invoice created successfully' })
  async create(@Body() createInvoiceDto: CreateInvoiceDto) {
    return await this.invoicesService.create(createInvoiceDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all invoices' })
  @ApiResponse({ status: 200, description: 'Return all invoices' })
  async findAll() {
    return await this.invoicesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an invoice by id' })
  @ApiResponse({ status: 200, description: 'Return the invoice' })
  async findOne(@Param('id') id: string) {
    return await this.invoicesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get all invoices for a user' })
  @ApiResponse({ status: 200, description: 'Return all invoices for the user' })
  async findByUser(@Param('userId') userId: string) {
    return await this.invoicesService.findByUser(userId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update invoice status' })
  @ApiResponse({ status: 200, description: 'Invoice status updated successfully' })
  async updateStatus(@Param('id') id: string, @Body('status') status: string) {
    return await this.invoicesService.updateStatus(id, status);
  }
}

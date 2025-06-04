import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InvoiceEntity } from './entities/invoice.entity';
import { CreateInvoiceDto } from './dto/create-invoice.dto';
import { UsersService } from '../users/users.service';
import { PricingElectricRulesService } from '../pricing-electric-rules/pricing-electric-rules.service';

@Injectable()
export class InvoicesService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly usersService: UsersService,
    private readonly pricingElectricRulesService: PricingElectricRulesService
  ) {}

  async create(createInvoiceDto: CreateInvoiceDto): Promise<InvoiceEntity> {
    const [user, pricingElectricRule] = await Promise.all([
      this.usersService.getUserEntityById(createInvoiceDto.userId),
      this.pricingElectricRulesService.findOne(createInvoiceDto.pricingElectricRuleId),
    ]);

    const invoice = this.invoiceRepository.create({
      ...createInvoiceDto,
      user,
      pricingElectricRule,
    });

    return await this.invoiceRepository.save(invoice);
  }

  async findAll(): Promise<InvoiceEntity[]> {
    return await this.invoiceRepository.find({
      relations: ['user', 'pricingElectricRule'],
    });
  }

  async findOne(id: string): Promise<InvoiceEntity> {
    const invoice = await this.invoiceRepository.findOne({
      where: { id },
      relations: ['user', 'pricingElectricRule'],
    });

    if (!invoice) {
      throw new NotFoundException(`Invoice with ID ${id} not found`);
    }

    return invoice;
  }

  async findByUser(userId: string): Promise<InvoiceEntity[]> {
    return await this.invoiceRepository.find({
      where: { user: { id: userId } },
      relations: ['user', 'pricingElectricRule'],
    });
  }

  async updateStatus(id: string, status: string): Promise<InvoiceEntity> {
    const invoice = await this.findOne(id);
    invoice.status = status;
    return await this.invoiceRepository.save(invoice);
  }
}

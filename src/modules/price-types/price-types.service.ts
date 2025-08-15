import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PriceTypeEntity } from './entities/price-type.entity';
import { CreatePriceTypeDto } from './dto/create-price-type.dto';
import { UpdatePriceTypeDto } from './dto/update-price-type.dto';
import { ResponseItem } from '@app/common/dtos';

@Injectable()
export class PriceTypesService {
  constructor(
    @InjectRepository(PriceTypeEntity)
    private readonly priceTypeRepository: Repository<PriceTypeEntity>
  ) {}

  async create(dto: CreatePriceTypeDto): Promise<PriceTypeEntity> {
    const priceType = this.priceTypeRepository.create(dto);
    return this.priceTypeRepository.save(priceType);
  }

  async findAll(): Promise<ResponseItem<PriceTypeEntity>> {
    const priceTypes = await this.priceTypeRepository.find();
    return new ResponseItem(priceTypes, 'Lấy danh sách loại giá thành công!');
  }

  async findOne(id: string): Promise<PriceTypeEntity> {
    const priceType = await this.priceTypeRepository.findOne({ where: { id } });
    if (!priceType) throw new NotFoundException('Loại giá không tìm thấy');
    return priceType;
  }

  async update(id: string, dto: UpdatePriceTypeDto): Promise<PriceTypeEntity> {
    const priceType = await this.findOne(id);
    Object.assign(priceType, dto);
    return this.priceTypeRepository.save(priceType);
  }

  async remove(id: string): Promise<void> {
    const priceType = await this.findOne(id);
    await this.priceTypeRepository.remove(priceType);
  }
}

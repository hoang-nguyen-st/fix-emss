import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MeterTypeEntity } from './entities/meter-type.entity';
import { CreateMeterTypeDto } from './dto/create-meter-type.dto';

@Injectable()
export class MeterTypesService {
  constructor(
    @InjectRepository(MeterTypeEntity)
    private readonly meterTypeRepository: Repository<MeterTypeEntity>
  ) {}

  async create(createMeterTypeDto: CreateMeterTypeDto): Promise<MeterTypeEntity> {
    const meterType = this.meterTypeRepository.create(createMeterTypeDto);
    return await this.meterTypeRepository.save(meterType);
  }

  async findAll(): Promise<MeterTypeEntity[]> {
    return await this.meterTypeRepository.find();
  }

  async findOne(id: string): Promise<MeterTypeEntity> {
    const meterType = await this.meterTypeRepository.findOne({
      where: { id },
    });

    if (!meterType) {
      throw new NotFoundException(`Meter type with ID ${id} not found`);
    }

    return meterType;
  }
}

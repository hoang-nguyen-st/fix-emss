import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VoltageLevelEntity } from './entities/voltage-level.entity';
import { CreateVoltageLevelDto } from './dto/create-voltage-level.dto';

@Injectable()
export class VoltageLevelsService {
  constructor(
    @InjectRepository(VoltageLevelEntity)
    private readonly voltageLevelRepository: Repository<VoltageLevelEntity>
  ) {}

  async create(createVoltageLevelDto: CreateVoltageLevelDto): Promise<VoltageLevelEntity> {
    const voltageLevel = this.voltageLevelRepository.create(createVoltageLevelDto);
    return await this.voltageLevelRepository.save(voltageLevel);
  }

  async findAll(): Promise<VoltageLevelEntity[]> {
    return await this.voltageLevelRepository.find();
  }

  async findOne(id: string): Promise<VoltageLevelEntity> {
    const voltageLevel = await this.voltageLevelRepository.findOne({
      where: { id },
    });

    if (!voltageLevel) {
      throw new NotFoundException(`Voltage level with ID ${id} not found`);
    }

    return voltageLevel;
  }
}

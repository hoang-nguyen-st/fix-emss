import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ZoneEntity } from './entities/zone.entity';
import { ZoneResourceEntity } from './entities/zone-resource.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { CreateZoneResourceDto } from './dto/create-zone-resource.dto';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(ZoneEntity)
    private readonly zoneRepository: Repository<ZoneEntity>,
    @InjectRepository(ZoneResourceEntity)
    private readonly zoneResourceRepository: Repository<ZoneResourceEntity>
  ) {}

  async create(createZoneDto: CreateZoneDto): Promise<ZoneEntity> {
    const zone = this.zoneRepository.create(createZoneDto);
    return await this.zoneRepository.save(zone);
  }

  async findAll(): Promise<ZoneEntity[]> {
    return await this.zoneRepository.find({
      relations: ['project', 'resources'],
    });
  }

  async findOne(id: string): Promise<ZoneEntity> {
    const zone = await this.zoneRepository.findOne({
      where: { id },
      relations: ['project', 'resources'],
    });

    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }

    return zone;
  }

  async createResource(createZoneResourceDto: CreateZoneResourceDto): Promise<ZoneResourceEntity> {
    const zoneResource = this.zoneResourceRepository.create(createZoneResourceDto);
    return await this.zoneResourceRepository.save(zoneResource);
  }

  async findZoneResources(zoneId: string): Promise<ZoneResourceEntity[]> {
    return await this.zoneResourceRepository.find({
      where: { zone: { id: zoneId } },
      relations: ['zone'],
    });
  }
}

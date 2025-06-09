import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ZoneEntity } from './entities/zone.entity';
import { CreateZoneDto } from './dto/create-zone.dto';
import { UpdateZoneDto } from './dto/update-zone.dto';
import { ZoneExternalData } from '@app/common/interfaces';
import { buildDataMapByAttribute } from '@app/helpers/buildDataMapByAttribute';
import { classifyMapDifferences, persistEntityChanges } from '@app/common/utils';
import { ProjectsService } from '../projects/projects.service';
import { ZONE_CONSTANTS } from '@Constant/zone';

@Injectable()
export class ZonesService {
  constructor(
    @InjectRepository(ZoneEntity)
    private zonesRepository: Repository<ZoneEntity>,
    private projectsService: ProjectsService
  ) {}

  create(createZoneDto: CreateZoneDto) {
    const zone = this.zonesRepository.create(createZoneDto);
    return this.zonesRepository.save(zone);
  }

  async syncZonesData(zones: ZoneExternalData[]): Promise<void> {
    if (zones.length === 0) return;

    const existingZones = await this.zonesRepository.find({
      where: {
        name: In(zones.map((zone) => zone.name)),
        project: { id: In(zones.map((zone) => zone.projectId)) },
      },
      relations: ['project'],
    });

    const externalMap = buildDataMapByAttribute<ZoneExternalData>(zones, 'name');
    const dbMap = buildDataMapByAttribute<ZoneEntity>(existingZones, 'name');
    const { toAddOrUpdate, toDelete } = await classifyMapDifferences<ZoneExternalData, ZoneEntity>(
      externalMap,
      dbMap,
      this.isZoneChanged.bind(this),
      this.mapZoneDataToZoneEntity.bind(this),
      this.zonesRepository.create.bind(this.zonesRepository)
    );

    await persistEntityChanges(this.zonesRepository, toAddOrUpdate, toDelete);
  }

  findAll() {
    return this.zonesRepository.find();
  }

  async findOne(id: string) {
    const zone = await this.zonesRepository.findOne({ where: { id } });
    if (!zone) {
      throw new NotFoundException(`Zone with ID ${id} not found`);
    }
    return zone;
  }

  async update(id: string, updateZoneDto: UpdateZoneDto) {
    const zone = await this.findOne(id);
    Object.assign(zone, updateZoneDto);
    return this.zonesRepository.save(zone);
  }

  async remove(id: string) {
    const zone = await this.findOne(id);
    return this.zonesRepository.remove(zone);
  }

  async findOneByProjectIdAndName(projectId: string, name: string): Promise<ZoneEntity> {
    const searchName = name ? name : ZONE_CONSTANTS.DEFAULT_NAME_ZONE;
    return this.zonesRepository.findOne({ where: { project: { id: projectId }, name: searchName } });
  }

  // =============================== UTILS ===============================
  private isZoneChanged(zone: ZoneEntity, external: ZoneExternalData): boolean {
    return zone.name !== external.name || zone.project.id !== external.projectId;
  }

  private async mapZoneDataToZoneEntity(zone: ZoneExternalData): Promise<Partial<ZoneEntity>> {
    const project = await this.projectsService.findOne(zone.projectId);
    const name = zone.name ? zone.name : ZONE_CONSTANTS.DEFAULT_NAME_ZONE;
    return {
      name,
      project,
    };
  }
}

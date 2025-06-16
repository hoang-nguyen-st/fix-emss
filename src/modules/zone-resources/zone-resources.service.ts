import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { ZoneResourceEntity } from './entities/zone-resource.entity';
import { CreateZoneResourceDto } from './dto/create-zone-resource.dto';
import { UpdateZoneResourceDto } from './dto/update-zone-resource.dto';
import { ZonesService } from '../zones/zones.service';
import { buildDataMapByAttribute } from '@app/helpers/buildDataMapByAttribute';
import { classifyMapDifferences, persistEntityChanges } from '@app/common/utils';
import { DeviceExternalData } from '@app/common/interfaces';
import { ResourceType } from '@Constant/enums';

@Injectable()
export class ZoneResourcesService {
  constructor(
    @InjectRepository(ZoneResourceEntity)
    private zoneResourcesRepository: Repository<ZoneResourceEntity>,
    private zonesService: ZonesService
  ) {}

  async create(createZoneResourceDto: CreateZoneResourceDto) {
    const { zoneId, ...resourceData } = createZoneResourceDto;
    await this.zonesService.findOne(zoneId);

    const zoneResource = this.zoneResourcesRepository.create({
      ...resourceData,
      zone: { id: zoneId },
    });
    return this.zoneResourcesRepository.save(zoneResource);
  }

  async syncZoneResourcesData(zoneResources: DeviceExternalData[]): Promise<void> {
    if (zoneResources.length === 0) return;

    const existingZoneResources = await this.zoneResourcesRepository.find({
      where: {
        devEUI: In(zoneResources.map((zoneResource) => zoneResource.devEUI)),
      },
      relations: ['zone'],
    });

    const externalMap = buildDataMapByAttribute<DeviceExternalData>(zoneResources, 'devEUI');
    const dbMap = buildDataMapByAttribute<ZoneResourceEntity>(existingZoneResources, 'devEUI');

    const { toAddOrUpdate, toDelete } = await classifyMapDifferences<DeviceExternalData, ZoneResourceEntity>(
      externalMap,
      dbMap,
      this.isZoneResourceChanged.bind(this),
      this.mapZoneResourceDataToZoneResourceEntity.bind(this),
      this.zoneResourcesRepository.create.bind(this.zoneResourcesRepository)
    );
    await persistEntityChanges(this.zoneResourcesRepository, toAddOrUpdate, toDelete);
  }

  findAll() {
    return this.zoneResourcesRepository.find({
      relations: ['zone'],
    });
  }

  async findOne(id: string) {
    const zoneResource = await this.zoneResourcesRepository.findOne({
      where: { id },
      relations: ['zone'],
    });
    if (!zoneResource) {
      throw new NotFoundException(`Zone resource with ID ${id} not found`);
    }
    return zoneResource;
  }

  async update(id: string, updateZoneResourceDto: UpdateZoneResourceDto) {
    const { zoneId, ...resourceData } = updateZoneResourceDto;
    const zoneResource = await this.findOne(id);

    if (zoneId) {
      await this.zonesService.findOne(zoneId);
      zoneResource.zone = { id: zoneId } as any;
    }

    Object.assign(zoneResource, resourceData);
    return this.zoneResourcesRepository.save(zoneResource);
  }

  async remove(id: string) {
    const zoneResource = await this.findOne(id);
    return this.zoneResourcesRepository.remove(zoneResource);
  }

  // =============================== UTILS ===============================

  private isZoneResourceChanged(zoneResource: ZoneResourceEntity, external: DeviceExternalData): boolean {
    return (
      zoneResource.devEUI !== external.devEUI ||
      zoneResource.name !== external.name ||
      zoneResource.sensorId !== external.sensorId ||
      zoneResource.description !== external.description ||
      zoneResource.deviceBrand !== external.deviceBrand ||
      zoneResource.systemType !== external.systemType ||
      zoneResource.dataType !== external.dataType ||
      zoneResource.brand !== external.brand ||
      zoneResource.sensorModel !== external.sensorModel ||
      zoneResource.alias !== external.alias ||
      zoneResource.equipmentName !== external.equipmentName ||
      zoneResource.iot !== external.iot
    );
  }

  private async mapZoneResourceDataToZoneResourceEntity(
    external: DeviceExternalData
  ): Promise<Partial<ZoneResourceEntity>> {
    return {
      ...external,
      resource: ResourceType.ELECTRIC,
    };
  }
}

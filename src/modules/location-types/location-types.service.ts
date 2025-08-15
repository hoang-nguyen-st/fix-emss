import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationTypeEntity } from './entities';
import { ResponseItem } from '@app/common/dtos';
import { LocationTypeNameDto } from './dto/location-type-name.dto';
import { UpdateLocationTypeDto } from './dto/request/update-location-type.dto';
import { CreateLocationTypeDto } from './dto/request/create-location-type.dto';

@Injectable()
export class LocationTypesService {
  constructor(
    @InjectRepository(LocationTypeEntity)
    private readonly locationTypeRepository: Repository<LocationTypeEntity>
  ) {}

  async create(createLocationTypeDto: CreateLocationTypeDto): Promise<ResponseItem<LocationTypeEntity>> {
    const locationType = this.locationTypeRepository.create(createLocationTypeDto);
    const savedLocationType = await this.locationTypeRepository.save(locationType);
    return new ResponseItem(savedLocationType, 'Tạo loại hình thức thành công');
  }

  async findAll(): Promise<ResponseItem<LocationTypeEntity[]>> {
    const locationTypes = await this.locationTypeRepository.find();
    return new ResponseItem<LocationTypeEntity[]>(locationTypes, 'Lấy danh sách loại hình thức thành công');
  }

  async findOneById(id: string): Promise<LocationTypeEntity> {
    const locationType = await this.locationTypeRepository.findOne({
      where: { id },
    });

    if (!locationType) {
      throw new NotFoundException('Không tìm thấy loại hình thức');
    }

    return locationType;
  }

  async findOne(id: string): Promise<ResponseItem<LocationTypeEntity>> {
    const locationType = await this.locationTypeRepository.findOne({
      where: { id },
    });

    if (!locationType) {
      throw new NotFoundException('Không tìm thấy loại hình thức');
    }

    return new ResponseItem(locationType, 'Lấy thông tin loại hình thức thành công');
  }

  async update(id: string, updateLocationTypeDto: UpdateLocationTypeDto): Promise<ResponseItem<LocationTypeEntity>> {
    const locationType = await this.locationTypeRepository.findOne({
      where: { id },
    });

    if (!locationType) {
      throw new NotFoundException('Không tìm thấy loại hình thức');
    }

    Object.assign(locationType, updateLocationTypeDto);
    const updatedLocationType = await this.locationTypeRepository.save(locationType);

    return new ResponseItem(updatedLocationType, 'Cập nhật loại hình thức thành công');
  }

  async remove(id: string): Promise<ResponseItem<void>> {
    const result = await this.locationTypeRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException('Không tìm thấy loại hình thức');
    }

    return new ResponseItem(null, 'Xóa loại hình thức thành công');
  }

  async getLocationTypes(): Promise<ResponseItem<LocationTypeEntity[]>> {
    const query = this.locationTypeRepository.createQueryBuilder('locationType');
    query.orderBy('locationType.createdAt', 'DESC');
    query.leftJoinAndSelect('locationType.tariffTiers', 'tariffTiers');
    query.leftJoinAndSelect('locationType.locationTypeVoltageLevels', 'locationTypeVoltageLevels');
    query.leftJoinAndSelect('locationType.priceTypeLocationTypes', 'priceTypeLocationTypes');
    const locationTypes = await query.getMany();

    return new ResponseItem<LocationTypeEntity[]>(locationTypes, 'Lấy danh sách loại vị trí thành công!');
  }

  async getLocationTypeNames(): Promise<ResponseItem<LocationTypeNameDto>> {
    const locationTypeNames = await this.locationTypeRepository.find({
      select: ['id', 'name', 'locationTypeEnum'],
    });
    return new ResponseItem(locationTypeNames, 'Lấy danh sách tên loại vị trí thành công!');
  }
}

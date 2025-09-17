import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetLocationDto } from './dto/get-location.dto';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { LocationDto } from './dto/location.dto';
import { LocationTypesService } from '../location-types/location-types.service';
import { PriceTypesService } from '../price-types/price-types.service';
import { UsersService } from '@UsersModule/users.service';
import { LocationTypeEnum } from '@Constant/enums';

@Injectable()
export class LocationsService {
  constructor(
    @InjectRepository(LocationEntity)
    private locationsRepository: Repository<LocationEntity>,
    private locationTypeService: LocationTypesService,
    private priceTypeService: PriceTypesService,
    private userService: UsersService
  ) {}

  async create(createLocationDto: CreateLocationDto): Promise<ResponseItem<LocationEntity>> {
    const locationType = await this.locationTypeService.findOneById(createLocationDto.locationTypeId);
    const user = await this.userService.findOne(createLocationDto.userId);

    if (!locationType) throw new BadRequestException('Loại hình thức không tồn tại');
    if (!user) throw new BadRequestException('Người dùng không tồn tại');

    let priceType = null;
    if (locationType.locationTypeEnum !== LocationTypeEnum.RESIDENTIAL) {
      priceType = await this.priceTypeService.findOne(createLocationDto.priceTypeId);
      if (!priceType) throw new BadRequestException('Loại biểu giá không tồn tại');
    }

    const locationData: Partial<LocationEntity> = {
      name: createLocationDto.name,
      description: createLocationDto.description,
      initialDate: new Date(createLocationDto.initialDate),
      locationType,
      user,
      ...(priceType ? { priceType } : {}),
    };

    const location = this.locationsRepository.create(locationData);
    const savedLocation = await this.locationsRepository.save(location);

    return new ResponseItem(savedLocation, 'Tạo địa điểm thành công!');
  }

  async getAllLocations(params: GetLocationDto): Promise<ResponsePaginate<LocationDto[]>> {
    const { skip, take, search, locationTypeId } = params;
    const query = this.locationsRepository.createQueryBuilder('locations');

    if (locationTypeId) {
      query.where('locations.locationType.id = :locationTypeId', { locationTypeId });
    }

    if (search) {
      query.andWhere('unaccent(LOWER(locations.name)) ILIKE unaccent(LOWER(:name))', { name: `%${search}%` });
    }

    query.leftJoinAndSelect('locations.locationType', 'locationType');
    query.leftJoinAndSelect('locations.workspace', 'workspace');
    query.leftJoinAndSelect('locations.user', 'user');
    query.leftJoinAndSelect('locations.priceType', 'priceType');

    query.orderBy('locations.createdAt', 'ASC');

    const [locations, total] = await query.skip(skip).take(take).getManyAndCount();

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(locations, pageMetaDto, 'Lấy danh sách vị trí thành công!');
  }

  async findAll(workspaceId: string): Promise<LocationEntity[]> {
    return await this.locationsRepository.find({
      where: { workspaceId },
      select: {
        id: true,
        name: true,
      },
    });
  }

  async findLocationById(id: string) {
    const location = await this.locationsRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Không tìm thấy địa điểm`);
    }
    return location;
  }

  async findOne(id: string): Promise<ResponseItem<LocationEntity>> {
    const location = await this.locationsRepository.findOne({
      where: { id },
      relations: ['user', 'locationType', 'priceType', 'workspace'],
    });
    if (!location) {
      throw new NotFoundException(`Không tìm thấy địa điểm`);
    }

    return new ResponseItem(location, 'Lấy chi tiết địa điểm thành công!');
  }

  async update(id: string, updateLocationDto: UpdateLocationDto): Promise<ResponseItem<LocationEntity>> {
    const location = await this.locationsRepository.findOne({ where: { id } });
    if (!location) {
      throw new NotFoundException(`Không tìm thấy địa điểm`);
    }

    Object.assign(location, updateLocationDto);
    const updatedLocation = await this.locationsRepository.save(location);

    return new ResponseItem(updatedLocation, 'Cập nhật địa điểm thành công!');
  }

  async remove(id: string): Promise<ResponseItem<void>> {
    const result = await this.locationsRepository.delete(id);

    if (result.affected === 0) {
      throw new NotFoundException(`Không tìm thấy địa điểm`);
    }

    return new ResponseItem(null, 'Xóa địa điểm thành công!');
  }
}

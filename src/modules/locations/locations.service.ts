import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, FindManyOptions } from 'typeorm';
import { LocationEntity } from '@app/modules/locations/entities/location.entity';
import { CreateLocationDto } from './dto/create-location.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { GetLocationDto } from './dto/get-location.dto';
import { PageMetaDto, ResponseItem, ResponsePaginate } from '@app/common/dtos';
import { LocationTypesService } from '../location-types/location-types.service';
import { PriceTypesService } from '../price-types/price-types.service';
import { UsersService } from '@UsersModule/users.service';
import { LocationTypeEnum } from '@Constant/enums';
import { LocationByWorkspaceDto } from './dto/get-location-by-workspace';

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

  async getLocationsByWorkspace(
    workspaceId: string,
    params: GetLocationDto
  ): Promise<ResponsePaginate<LocationByWorkspaceDto[]>> {
    const { skip, take, search, locationTypeId } = params;

    const whereConditions: FindManyOptions<LocationEntity>['where'] = {
      workspace: { id: workspaceId },
    };

    if (locationTypeId) {
      whereConditions.locationType = { id: locationTypeId };
    }

    if (search) {
      whereConditions.name = Like(`%${search}%`);
    }

    const queryOptions: FindManyOptions<LocationEntity> = {
      where: whereConditions,
      relations: {
        locationType: true,
        user: true,
        locationDevices: {
          device: true,
        },
      },
      order: {
        createdAt: 'DESC' as const,
      },
      select: {
        id: true,
        name: true,
        status: true,
        createdAt: true,
        locationType: {
          id: true,
          name: true,
        },
        user: {
          id: true,
          name: true,
        },
        locationDevices: {
          id: true,
          device: {
            id: true,
            name: true,
          },
        },
      },
      skip,
      take,
    } as const;

    const [locations, total] = await this.locationsRepository.findAndCount(queryOptions);

    const pageMetaDto = new PageMetaDto({ itemCount: total, pageOptionsDto: params });

    return new ResponsePaginate(locations, pageMetaDto, 'Lấy danh sách vị trí thành công!');
  }

  findAll() {
    return this.locationsRepository.find();
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

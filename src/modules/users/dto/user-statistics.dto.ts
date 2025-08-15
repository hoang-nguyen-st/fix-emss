import { UserStatusEnum } from '@Constant/enums';
import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class UserStatusStatisticsDto {
  @Expose()
  @ApiProperty({
    example: 'active',
    description: 'Trạng thái người dùng',
    enum: UserStatusEnum,
  })
  status: UserStatusEnum;

  @Expose()
  @ApiProperty({
    example: 10,
    description: 'Số lượng người dùng theo trạng thái',
  })
  count: number;
}

export class UserStatisticsDataDto {
  @Expose()
  @Type(() => UserStatusStatisticsDto)
  @ApiProperty({
    type: [UserStatusStatisticsDto],
    description: 'Danh sách thống kê theo trạng thái',
  })
  data: UserStatusStatisticsDto[];

  @Expose()
  @ApiProperty({
    example: 25,
    description: 'Tổng số người dùng',
  })
  total: number;
}

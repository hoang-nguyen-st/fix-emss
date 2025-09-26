import { BadRequestException, Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { InvoicesService } from './invoices.service';
import { CalculateElectricDto } from './dto/request/calculate-electric.dto';
import {
  ResidentialCalculationResponseDto,
  BusinessCalculationResponseDto,
  ProductionCalculationResponseDto,
} from './dto/response/calculate-electric-response.dto';

@ApiTags('Invoices')
@ApiBearerAuth()
@UseGuards(JwtAccessTokenGuard)
@Controller('invoices')
export class InvoicesController {
  constructor(private readonly invoicesService: InvoicesService) {}

  @Get('calculate')
  @ApiOperation({
    summary: 'Tính toán hóa đơn điện',
    description: `
      Tính toán hóa đơn điện dựa trên loại hình thức của địa điểm:
      
      **Hộ sinh hoạt (RESIDENTIAL):**
      - Chỉ có 1 thiết bị đo điện
      - Sử dụng bảng giá bậc thang (tariff tiers)
      - Tính theo từng bậc với đơn giá khác nhau
      
      **Hộ kinh doanh (BUSINESS):**
      - Có thể có nhiều thiết bị đo điện
      - Sử dụng đơn giá cố định theo mức điện áp
      - Mỗi thiết bị có voltage value khác nhau sẽ có đơn giá khác nhau
      
      **Hộ sản xuất (PRODUCTION):**
      - Có thể có nhiều thiết bị đo điện
      - Sử dụng đơn giá cố định theo mức điện áp
      - Tương tự như kinh doanh nhưng có bảng giá riêng
      
      **Các mức điện áp hỗ trợ:**
      - Dưới 6 kV
      - Từ 6 kV đến dưới 22 kV
      - Từ 22 kV đến dưới 110 kV
      - Trên 110 kV
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Tính toán thành công cho hộ sinh hoạt',
    type: ResidentialCalculationResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Tính toán thành công cho hộ kinh doanh',
    type: BusinessCalculationResponseDto,
  })
  @ApiResponse({
    status: 200,
    description: 'Tính toán thành công cho hộ sản xuất',
    type: ProductionCalculationResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Dữ liệu đầu vào không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Hộ sinh hoạt chỉ được phép có duy nhất 1 thiết bị' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Không tìm thấy dữ liệu cần thiết',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Địa điểm không tồn tại' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiInternalServerErrorResponse({
    description: 'Lỗi hệ thống',
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'number', example: 500 },
        message: { type: 'string', example: 'Internal server error' },
        error: { type: 'string', example: 'Internal Server Error' },
      },
    },
  })
  async calculateElectric(@Query() dto: CalculateElectricDto) {
    if (dto.endDate && new Date(dto.endDate) < new Date(dto.startDate)) {
      throw new BadRequestException('endDate must be after or equal startDate');
    }
    return await this.invoicesService.calculateElectric(dto);
  }
}

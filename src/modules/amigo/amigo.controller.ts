import { Body, Controller, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiBody, ApiTags } from '@nestjs/swagger';
import { AmigoService } from './amigo.service';

@ApiTags('Amigo')
@ApiBearerAuth()
@Controller('amigo')
export class AmigoController {
  constructor(private readonly amigoService: AmigoService) {}

  @Post('analytics/single')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        projectId: { type: 'string' },
        sensorId: { type: 'string' },
        interval: { type: 'string', example: '9999m' },
        startTime: { type: 'string', example: '2025-09-09T08:40:00.000Z' },
        endTime: { type: 'string', example: '2025-09-10T08:40:00.000Z' },
        systemType: { type: 'number', example: 1 },
      },
      required: ['projectId', 'sensorId', 'interval', 'startTime', 'endTime', 'systemType'],
    },
  })
  async getSingleAnalyticalChart(@Body() body: any) {
    return this.amigoService.getSingleAnalyticalChart(body);
  }
}

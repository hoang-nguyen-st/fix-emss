import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataCrawlerService } from '@app/modules/data-crawler/data-crawler.service';
import { GetSingleAnalyticChartDto } from './dto/get-single-analytic-chart';

@Injectable()
export class AmigoService {
  constructor(
    private readonly httpService: HttpService,
    @Inject(forwardRef(() => DataCrawlerService))
    private readonly dataCrawlerService: DataCrawlerService
  ) {}

  async getSingleAnalyticalChart(payload: GetSingleAnalyticChartDto): Promise<any> {
    const accessToken = await this.dataCrawlerService.getCurrentAccessToken();
    const url = `https://amigo.veep.vn/gateway/iot/api/IoTSensor/Analytics/GetSingleAnalyticalChart`;
    const headers = {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };
    const response = await firstValueFrom(this.httpService.post(url, payload, { headers }));
    return response.data;
  }
}

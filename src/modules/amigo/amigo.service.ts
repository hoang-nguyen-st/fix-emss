import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { DataCrawlerService } from '@app/modules/data-crawler/data-crawler.service';

@Injectable()
export class AmigoService {
  constructor(private readonly httpService: HttpService, private readonly dataCrawlerService: DataCrawlerService) {}

  async getSingleAnalyticalChart(payload: {
    projectId: string;
    sensorId: string;
    interval: string;
    startTime: string;
    endTime: string;
    systemType: number;
  }): Promise<any> {
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

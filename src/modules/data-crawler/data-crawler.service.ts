import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import * as qs from 'qs';
import { GeminiService } from '../gemini/gemini.service';
import { generateRandomString } from '@app/common/utils/randomStringUtils';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DeviceEntity } from '@app/modules/devices/entities/device.entity';
import { WorkspaceEntity } from '@app/modules/workspaces/entities/workspace.entity';
import { LocationDeviceEntity } from '@app/modules/location-devices/entities/location-device.entity';
import { AmigoApiResponseDto, AmigoSensorDto, AmigoProjectApiResponseDto, AmigoProjectDto } from './dto';
import { plainToInstance } from 'class-transformer';
import { TimeSlotEntity } from '@app/modules/price-types/entities/time-slot.entity';
import { PriceTypeEnum, LocationTypeEnum, TimeSlotDayTypeEnum, TimeSlotNameEnum } from '@app/common/constants/enums';
import { AmigoService } from '@app/modules/amigo/amigo.service';
import { forwardRef, Inject } from '@nestjs/common';

@Injectable()
export class DataCrawlerService {
  private readonly logger = new Logger(DataCrawlerService.name);
  private readonly apiEndpoint: string;
  private readonly authConfig: Record<string, string>;
  private accessToken: string;
  private isRefreshing = false;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly geminiService: GeminiService,
    @InjectRepository(DeviceEntity)
    private readonly deviceRepository: Repository<DeviceEntity>,
    @InjectRepository(WorkspaceEntity)
    private readonly workspaceRepository: Repository<WorkspaceEntity>,
    @InjectRepository(LocationDeviceEntity)
    private readonly locationDeviceRepository: Repository<LocationDeviceEntity>,
    @InjectRepository(TimeSlotEntity)
    private readonly timeSlotRepository: Repository<TimeSlotEntity>,
    @Inject(forwardRef(() => AmigoService))
    private readonly amigoService: AmigoService
  ) {
    this.apiEndpoint = this.configService.get<string>('DATA_CRAWLER_API_ENDPOINT');
    this.authConfig = {
      username: this.configService.get<string>('AUTH_USERNAME'),
      password: this.configService.get<string>('AUTH_PASSWORD'),
      tenantCode: this.configService.get<string>('AUTH_TENANT_CODE'),
      clientId: this.configService.get<string>('AUTH_CLIENT_ID'),
      clientSecret: this.configService.get<string>('AUTH_CLIENT_SECRET'),
      authType: this.configService.get<string>('AUTH_TYPE'),
      grantType: this.configService.get<string>('AUTH_GRANT_TYPE'),
    };
    this.initializeAccessToken();
    this.initializeAutoSync();
  }

  private async initializeAccessToken(): Promise<void> {
    try {
      this.logger.log('Initializing access token...');
      this.accessToken = await this.getAccessToken();
      this.logger.log('Access token initialized successfully');
    } catch (error) {
      this.logger.error('Failed to initialize access token:', error.message);
    }
  }

  private async initializeAutoSync(): Promise<void> {
    try {
      this.logger.log('Starting auto-sync initialization...');

      setTimeout(async () => {
        try {
          this.logger.log('Auto-sync starting...');
          await this.syncAllDevicesFromProjects();
          this.logger.log('Auto-sync completed successfully');
        } catch (error) {
          this.logger.error('Auto-sync failed:', error.message);
        }
      }, 10000);
    } catch (error) {
      this.logger.error('Failed to initialize auto-sync:', error.message);
    }
  }

  public async getSyncStatus(): Promise<{
    success: boolean;
    message: string;
    workspaceCount: number;
    deviceCount: number;
    locationDeviceCount: number;
    lastSyncTime?: Date;
    nextSyncTime?: Date;
  }> {
    try {
      const workspaces = await this.workspaceRepository.find();
      const devices = await this.deviceRepository.find();
      const locationDevices = await this.locationDeviceRepository.find({
        relations: ['device'],
      });

      const now = new Date();
      const nextSync = new Date(now.getTime() + 6 * 60 * 60 * 1000);

      return {
        success: true,
        message: 'Sync status retrieved successfully',
        workspaceCount: workspaces.length,
        deviceCount: devices.length,
        locationDeviceCount: locationDevices.length,
        lastSyncTime: now,
        nextSyncTime: nextSync,
      };
    } catch (error) {
      this.logger.error('Failed to get sync status:', error.message);
      return {
        success: false,
        message: `Failed to get sync status: ${error.message}`,
        workspaceCount: 0,
        deviceCount: 0,
        locationDeviceCount: 0,
      };
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async scheduledRefreshAccessToken(): Promise<void> {
    if (!this.accessToken && !this.isRefreshing) {
      try {
        this.logger.log('Starting scheduled access token refresh...');
        this.isRefreshing = true;
        this.accessToken = await this.getAccessToken();
        this.logger.log('Access token refreshed successfully via scheduled job');
      } catch (error) {
        this.logger.error('Failed to refresh access token via scheduled job:', error.message);
      } finally {
        this.isRefreshing = false;
      }
    } else {
      this.logger.log('Skipping scheduled refresh - token exists or refresh in progress');
    }
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async scheduledAutoSync(): Promise<void> {
    try {
      this.logger.log('Starting scheduled auto-sync...');
      await this.syncAllDevicesFromProjects();
      this.logger.log('Scheduled auto-sync completed successfully');
    } catch (error) {
      this.logger.error('Scheduled auto-sync failed:', error.message);
    }
  }

  @Cron(CronExpression.EVERY_30_MINUTES)
  async scheduledLocationDevicesSync(): Promise<void> {
    try {
      const locationDevices = await this.locationDeviceRepository.find({
        relations: ['device', 'location', 'location.priceType', 'location.locationType'],
      });

      if (!locationDevices.length) {
        this.logger.log('No location-device relationships to sync.');
        return;
      }

      for (const ld of locationDevices) {
        try {
          if (!ld.device || !ld.device.sensorId || !ld.device.workspaceId) continue;

          const fieldKey = ld.device.fieldCalculate;
          const latest = await this.getLatestStorageFromAmigo(ld.device.workspaceId, ld.device.sensorId, fieldKey);
          if (!latest) continue;

          const latestValue = Number(latest.value);
          const latestTime = new Date(latest.timestamp);

          const prevOverall = Number(ld.currentIndex ?? 0);
          const periodStart = Number(ld.periodStartIndex ?? 0);

          if (!isNaN(prevOverall) && latestValue === prevOverall) {
            continue;
          }

          ld.currentIndex = latestValue;

          const isResidential = ld.location?.locationType?.locationTypeEnum === LocationTypeEnum.RESIDENTIAL;
          const priceTypeEnum = ld.location?.priceType?.priceTypeEnum;

          if (isResidential || priceTypeEnum === PriceTypeEnum.PRICE_TYPE_1) {
            await this.locationDeviceRepository.save(ld);
            continue;
          }

          if (priceTypeEnum === PriceTypeEnum.PRICE_TYPE_3) {
            const dayType = this.getDayType(latestTime);
            const slotName = await this.getTimeSlotNameForTimestamp(dayType, latestTime);

            const delta = latestValue - (isNaN(prevOverall) ? 0 : prevOverall);
            if (!(delta >= 0)) {
              await this.locationDeviceRepository.save(ld);
              continue;
            }

            const result = delta + (isNaN(periodStart) ? 0 : periodStart);

            if (slotName === TimeSlotNameEnum.PEAK) {
              ld.peakCurrentIndex = Number(ld.peakCurrentIndex ?? 0) + result;
            } else if (slotName === TimeSlotNameEnum.MID_PEAK) {
              ld.midCurrentIndex = Number(ld.midCurrentIndex ?? 0) + result;
            } else if (slotName === TimeSlotNameEnum.OFF_PEAK) {
              ld.offPeakCurrentIndex = Number(ld.offPeakCurrentIndex ?? 0) + result;
            }

            await this.locationDeviceRepository.save(ld);
            continue;
          }

          await this.locationDeviceRepository.save(ld);
        } catch (innerErr) {
          this.logger.error(`Failed to sync location-device ${ld.id}: ${innerErr?.message}`);
        }
      }
    } catch (error) {
      this.logger.error('Scheduled location devices sync failed:', error.message);
    }
  }

  public async getCurrentAccessToken(): Promise<string> {
    if (!this.accessToken) {
      this.logger.log('No access token available, fetching new one...');
      this.accessToken = await this.getAccessToken();
    }
    return this.accessToken;
  }

  public async forceRefreshAccessToken(): Promise<string> {
    try {
      this.logger.log('Force refreshing access token due to expiration...');
      this.isRefreshing = true;
      this.accessToken = await this.getAccessToken();
      this.logger.log('Access token force refreshed successfully');
      return this.accessToken;
    } catch (error) {
      this.logger.error('Failed to force refresh access token:', error.message);
      throw error;
    } finally {
      this.isRefreshing = false;
    }
  }

  public async validateAndGetToken(): Promise<string> {
    if (!this.accessToken) {
      return this.getCurrentAccessToken();
    }

    try {
      return this.accessToken;
    } catch (error) {
      if (error.response?.status === 401) {
        this.logger.warn('Token expired, forcing refresh...');
        return this.forceRefreshAccessToken();
      }
      throw error;
    }
  }

  private async getVcToken() {
    const captchaKey = generateRandomString(this.configService.get<string>('CAPTCHA_KEY'));
    const url = `${this.apiEndpoint}/neurongateway/neuron/captcha?key=${captchaKey}`;
    const response = await firstValueFrom(this.httpService.get(url, { responseType: 'arraybuffer' }));
    const base64 = Buffer.from(response.data).toString('base64');
    const imageDataUrl = `data:image/png;base64,${base64}`;
    const captchaText = await this.geminiService.readCaptcha(imageDataUrl);
    return { captchaText, captchaKey };
  }

  private async crawlAccessToken(code: string, captchaKey: string) {
    const url = `${this.apiEndpoint}/neurongateway/neuron/oauth/token`;
    const body = qs.stringify({
      username: this.authConfig.username,
      password: this.authConfig.password,
      vc_code: code,
      vc_token: captchaKey,
      tenant_code: this.authConfig.tenantCode,
      grant_type: this.authConfig.grantType,
      client_id: this.authConfig.clientId,
      client_secret: this.authConfig.clientSecret,
      auth_type: this.authConfig.authType,
    });
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    try {
      const response = await firstValueFrom(this.httpService.post(url, body, { headers }));

      return response?.data ?? [];
    } catch (error) {
      this.logger.error(`Failed to fetch data from ${url}:`, error.message);
      throw error;
    }
  }

  public async getAccessToken(): Promise<string> {
    try {
      const { captchaText, captchaKey } = await this.getVcToken();
      const tokenResponse = await this.crawlAccessToken(captchaText, captchaKey);
      return tokenResponse.data.access_token;
    } catch (error) {
      this.logger.error('Failed to get access token:', error.message);
      throw error;
    }
  }

  public async getSensorsAndSync(
    projectId: string,
    systemType: number
  ): Promise<{ success: boolean; message: string; syncedCount: number }> {
    try {
      const accessToken = await this.getCurrentAccessToken();

      const url = `https://amigo.veep.vn/gateway/iot/api/IoTSensor/GetSensorsByProjectUser`;
      const params = { projectId, systemType };

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const apiResponse = plainToInstance(AmigoApiResponseDto, response.data);

      if (!apiResponse.isSuccess || apiResponse.code !== 0) {
        throw new Error(`API call failed: ${apiResponse.message}`);
      }

      const syncedCount = await this.syncSensorsToDatabase(apiResponse.data, projectId);

      return {
        success: true,
        message: `Successfully synced ${syncedCount} sensors`,
        syncedCount,
      };
    } catch (error) {
      this.logger.error(`Failed to get sensors and sync for project ${projectId}:`, error.message);
      throw error;
    }
  }

  private async syncSensorsToDatabase(sensors: AmigoSensorDto[], projectId: string): Promise<number> {
    let syncedCount = 0;

    for (const sensor of sensors) {
      try {
        const existingDevice = await this.deviceRepository.findOne({
          where: { devEUI: sensor.devEUI, sensorId: sensor.sensorId },
        });

        if (existingDevice) {
          existingDevice.name = sensor.name;
          existingDevice.description = sensor.description;
          existingDevice.status = true;
          existingDevice.workspaceId = projectId;

          await this.deviceRepository.save(existingDevice);
        } else {
          const newDevice = this.deviceRepository.create({
            devEUI: sensor.devEUI,
            sensorId: sensor.sensorId,
            name: sensor.name,
            description: sensor.description,
            status: true,
            workspaceId: projectId,
            createdBy: 'amigo',
            updatedBy: 'amigo',
          } as DeviceEntity);

          await this.deviceRepository.save(newDevice);
        }

        syncedCount++;
      } catch (error) {
        this.logger.error(`Failed to sync sensor ${sensor.sensorId}:`, error.message);
      }
    }

    return syncedCount;
  }

  public async syncAllProjects(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    try {
      this.logger.log('Fetching all projects from Amigo API...');

      const accessToken = await this.getCurrentAccessToken();

      const url = `https://amigo.veep.vn/gateway/project/api/Project/EnterprisePageList`;
      const params = { pageSize: -1 };

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      );
      const apiResponse = plainToInstance(AmigoProjectApiResponseDto, response.data);

      if (!apiResponse.isSuccess) {
        throw new Error(`API call failed: ${apiResponse.message}`);
      }

      const syncedCount = await this.syncProjectsToDatabase(apiResponse.data.data);

      this.logger.log(`Successfully synced ${syncedCount} projects`);

      return {
        success: true,
        message: `Successfully synced ${syncedCount} projects`,
        syncedCount,
      };
    } catch (error) {
      this.logger.error('Failed to sync projects:', error.message);
      throw error;
    }
  }

  private async syncProjectsToDatabase(projects: AmigoProjectDto[]): Promise<number> {
    let syncedCount = 0;

    for (const project of projects) {
      try {
        const existingWorkspace = await this.workspaceRepository.findOne({
          where: { id: project.id },
        });

        if (existingWorkspace) {
          existingWorkspace.name = project.name;
          existingWorkspace.updatedBy = 'amigo';

          await this.workspaceRepository.save(existingWorkspace);
        } else {
          const newWorkspace = this.workspaceRepository.create({
            id: project.id,
            name: project.name,
            createdBy: 'amigo',
            updatedBy: 'amigo',
            createdAt: project.creationTime,
            updatedAt: project.creationTime,
          } as WorkspaceEntity);

          await this.workspaceRepository.save(newWorkspace);
        }

        syncedCount++;
      } catch (error) {
        this.logger.error(`Failed to sync project ${project.name}:`, error.message);
      }
    }

    return syncedCount;
  }

  public async syncAllDevicesFromProjects(): Promise<{ success: boolean; message: string; totalSyncedCount: number }> {
    try {
      this.logger.log('Starting full sync: projects and devices...');

      const projectResult = await this.syncAllProjects();
      if (!projectResult.success) {
        throw new Error('Failed to sync projects');
      }

      const accessToken = await this.getCurrentAccessToken();
      const url = `https://amigo.veep.vn/gateway/project/api/Project/EnterprisePageList`;
      const params = { pageSize: -1 };

      const response = await firstValueFrom(
        this.httpService.get(url, {
          params,
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        })
      );

      const apiResponse = plainToInstance(AmigoProjectApiResponseDto, response.data);
      if (!apiResponse.isSuccess) {
        throw new Error(`Failed to fetch projects for device sync: ${apiResponse.message}`);
      }

      let totalDeviceCount = 0;
      for (const project of apiResponse.data.data) {
        try {
          const deviceResult = await this.getSensorsAndSync(project.id, 1);
          if (deviceResult.success) {
            totalDeviceCount += deviceResult.syncedCount;
          }
        } catch (error) {
          this.logger.error(`Failed to sync devices for project ${project.name}:`, error.message);
        }
      }

      return {
        success: true,
        message: `Full sync completed. Projects: ${projectResult.syncedCount}, Total devices: ${totalDeviceCount}`,
        totalSyncedCount: totalDeviceCount,
      };
    } catch (error) {
      this.logger.error('Failed to perform full sync:', error.message);
      throw error;
    }
  }

  private getDayType(date: Date): TimeSlotDayTypeEnum {
    const day = date.getDay();
    return day === 0 || day === 6 ? TimeSlotDayTypeEnum.WEEKEND : TimeSlotDayTypeEnum.WEEKDAY;
  }

  private async getTimeSlotNameForTimestamp(
    dayType: TimeSlotDayTypeEnum,
    date: Date
  ): Promise<TimeSlotNameEnum | null> {
    const timeString = date.toTimeString().slice(0, 8);
    const slots = await this.timeSlotRepository.find({ where: { dayType } });

    const matched = slots.find((slot) => {
      const start = slot.startTime;
      const end = slot.endTime;

      if (start < end) {
        return timeString >= start && timeString < end;
      }
      return timeString >= start || timeString < end;
    });

    return matched?.name ?? null;
  }

  private async getLatestStorageFromAmigo(
    projectId: string,
    sensorId: string,
    fieldKey?: string
  ): Promise<{ timestamp: string; value: number } | null> {
    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 24 * 60 * 60 * 1000);

      const payload = {
        projectId,
        sensorId,
        interval: '1y',
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        systemType: 1,
      };

      const res = await this.amigoService.getSingleAnalyticalChart(payload as any);
      const data = res?.data;

      const series: any[] = Array.isArray(data?.[fieldKey]) ? data[fieldKey] : [];
      if (!series.length) return null;

      const last = series[series.length - 1];
      if (Array.isArray(last) && last.length >= 2) {
        const ts = new Date(last[0]).toISOString();
        const val = Number(last[1]);
        if (!isNaN(val)) return { timestamp: ts, value: val };
      }

      return null;
    } catch (error) {
      this.logger.error('Failed to fetch latest storage from Amigo:', error.message);
      return null;
    }
  }
}

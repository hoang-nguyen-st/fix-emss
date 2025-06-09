import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';
import { ProjectUsersService } from '../project-users/project-users.service';
import { UsersService } from '@UsersModule/users.service';
import { AccountExternalData, DeviceExternalData, ProjectExternalData, ZoneExternalData } from '@app/common/interfaces';
import { CronJob } from 'cron';
import { ZonesService } from '../zones/zones.service';
import { ZoneResourcesService } from '../zone-resources/zone-resources.service';
import { ZONE_CONSTANTS } from '@Constant/zone';

/**
 * Service responsible for crawling and synchronizing data from external API
 */
@Injectable()
export class DataCrawlerService {
  private readonly logger = new Logger(DataCrawlerService.name);
  private readonly apiEndpoint: string;
  private readonly accessToken: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly projectsService: ProjectsService,
    private readonly projectUsersService: ProjectUsersService,
    private readonly usersService: UsersService,
    private readonly zonesService: ZonesService,
    private readonly zoneResourcesService: ZoneResourcesService
  ) {
    this.apiEndpoint = this.configService.get<string>('DATA_CRAWLER_API_ENDPOINT');
    this.accessToken = this.configService.get<string>('JWT_ACCESS_TOKEN_AMIGO');
  }

  /**
   * Initializes the module and sets up cron jobs
   */
  onModuleInit() {
    this.setupCronJobs();
  }

  /**
   * Sets up cron jobs for data synchronization
   * Configures jobs for projects, accounts, and devices based on environment variables
   */
  private setupCronJobs() {
    const projectCronTime = this.configService.get<string>('PROJECT_CRON_TIME');
    const accountCronTime = this.configService.get<string>('ACCOUNT_CRON_TIME');

    const projectJob = new CronJob(projectCronTime, () => {
      this.crawlProjectData();
    });

    const accountJob = new CronJob(accountCronTime, () => {
      this.crawlAccountData();
    });

    const deviceJob = new CronJob(accountCronTime, () => {
      this.crawlDeviceData();
    });

    this.schedulerRegistry.addCronJob('projectJob', projectJob);
    this.schedulerRegistry.addCronJob('accountJob', accountJob);
    this.schedulerRegistry.addCronJob('deviceJob', deviceJob);

    projectJob.start();
    accountJob.start();
    deviceJob.start();
  }

  /**
   * Fetches data from the external API
   * @param endpoint - API endpoint to fetch data from
   * @returns Promise with the fetched data
   * @throws Error if the request fails
   */
  private async fetchData(endpoint: string): Promise<any> {
    const url = `${this.apiEndpoint}${endpoint}`;
    const headers = {
      Authorization: `Bearer ${this.accessToken}`,
    };

    try {
      const response = await firstValueFrom(this.httpService.get(url, { headers }));
      return response?.data ?? [];
    } catch (error) {
      this.logger.error(`Failed to fetch data from ${endpoint}:`, error.message);
      throw error;
    }
  }

  /**
   * Fetches all projects from the external API
   * @returns Promise with array of ProjectData
   */
  private async fetchProjects(): Promise<ProjectExternalData[]> {
    const response = await this.fetchData('/project/api/Project/EnterprisePageList?pageSize=-1');
    const rawProjects = response?.data?.data ?? [];
    return rawProjects.map((project: ProjectExternalData) => ({
      id: project.id,
      name: project.name,
    }));
  }

  /**
   * Fetches all accounts for a specific project
   * @param projectId - ID of the project to fetch accounts for
   * @returns Promise with array of AccountData
   */
  private async fetchAccountInProject(projectId: string): Promise<AccountExternalData[]> {
    const response = await this.fetchData(`/project/api/Project/Users?projectId=${projectId}&keyWord=&roleName=`);
    const rawAccounts = response?.data ?? [];
    return this.transformAndFilterAccounts(rawAccounts);
  }

  /**
   * Fetches all devices and their zones for a specific project
   * @param projectId - ID of the project to fetch devices for
   * @returns Promise with object containing arrays of zones and devices
   */
  private async fetchDevicesInProject(projectId: string): Promise<{
    zones: ZoneExternalData[];
    devices: DeviceExternalData[];
  }> {
    const response = await this.fetchData(
      `/iot/api/IoTSensor/GetSensorsByProjectUser?projectId=${projectId}&systemType=1`
    );
    const rawDevices = response?.data ?? [];
    return this.transformAndFilterDevices(projectId, rawDevices);
  }

  /**
   * Transforms and filters device data, extracting unique zones
   * @param projectId - ID of the project the devices belong to
   * @param devices - Array of raw device data
   * @returns Object containing arrays of transformed zones and devices
   */
  private transformAndFilterDevices(
    projectId: string,
    devices: DeviceExternalData[]
  ): {
    zones: ZoneExternalData[];
    devices: DeviceExternalData[];
  } {
    const zoneSet = new Set<string>();

    for (const device of devices) {
      const location = device.location ? device.location.trim() : ZONE_CONSTANTS.DEFAULT_NAME_ZONE;
      zoneSet.add(location);
    }

    const zones: ZoneExternalData[] = Array.from(zoneSet).map((name) => ({ name, projectId }));
    return { zones, devices };
  }

  /**
   * Transforms and filters raw account data from API to match AccountData interface
   * @param data - Raw account data from API
   * @returns Array of transformed and filtered AccountData objects
   */
  private transformAndFilterAccounts(data: any[]): AccountExternalData[] {
    return data.reduce((acc: AccountExternalData[], u: any) => {
      u.id = u.userId;
      if (u.id && u.email && u.nickName) {
        acc.push(u);
      }
      return acc;
    }, []);
  }

  /**
   * Crawls and synchronizes project data
   * Runs based on PROJECT_CRON_TIME environment variable
   */
  public async crawlProjectData() {
    const t0 = performance.now();
    this.logger.log('Starting data project crawling process...');
    try {
      const projects = await this.fetchProjects();
      this.logger.log(`Extracted ${projects.length} projects`);
      await this.projectsService.createOrUpdateProjects(projects);
      const t1 = performance.now();
      this.logger.log(`crawlProjectData took ${(t1 - t0).toFixed(2)} ms`);
      return projects;
    } catch (error) {
      this.logger.error('Error during data crawling:', error.message);
      throw error;
    }
  }

  /**
   * Crawls and synchronizes account data for all projects
   * Runs based on ACCOUNT_CRON_TIME environment variable
   */
  public async crawlAccountData() {
    const t0 = performance.now();
    this.logger.log('Starting data account crawling process...');
    try {
      const projects = await this.projectsService.findAll();
      for (const project of projects) {
        const users = await this.fetchAccountInProject(project.id);
        await this.usersService.syncUsersData(project, users);
        await this.projectUsersService.syncUsersDataToProject(project, users);
      }
      const t1 = performance.now();
      this.logger.log(`crawlAccountData took ${(t1 - t0).toFixed(2)} ms`);
    } catch (error) {
      this.logger.error('Error during data crawling:', error.message);
      throw error;
    }
  }

  /**
   * Crawls and synchronizes device and zone data for all projects
   * Runs based on ACCOUNT_CRON_TIME environment variable
   */
  public async crawlDeviceData() {
    const t0 = performance.now();
    this.logger.log('Starting data device crawling process...');
    try {
      const projects = await this.projectsService.findAll();
      for (const project of projects) {
        const { zones, devices } = await this.fetchDevicesInProject(project.id);
        await this.zonesService.syncZonesData(zones);
        await this.zoneResourcesService.syncZoneResourcesData(devices);
      }
      const t1 = performance.now();
      this.logger.log(`crawlDeviceData took ${(t1 - t0).toFixed(2)} ms`);
    } catch (error) {
      this.logger.error('Error during data crawling:', error.message);
      throw error;
    }
  }

  /**
   * Manually triggers the crawling process for projects, accounts, and devices
   * This method can be called to force an immediate data synchronization
   */
  public async triggerCrawl(): Promise<void> {
    await this.crawlProjectData();
    await this.crawlAccountData();
    await this.crawlDeviceData();
  }
}

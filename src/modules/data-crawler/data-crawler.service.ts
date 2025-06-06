import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { ProjectsService } from '../projects/projects.service';
import { ProjectUsersService } from '../project-users/project-users.service';
import { UsersService } from '@UsersModule/users.service';

/**
 * Interface representing project data from external API
 */
export interface ProjectData {
  id: string;
  name: string;
}

/**
 * Interface representing account data from external API
 */
export interface AccountData {
  id: string;
  email: string;
  nickName: string;
  phoneNumber: string;
  roleName: string;
}

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
    private readonly projectsService: ProjectsService,
    private readonly projectUsersService: ProjectUsersService,
    private readonly usersService: UsersService
  ) {
    this.apiEndpoint = this.configService.get<string>('DATA_CRAWLER_API_ENDPOINT');
    this.accessToken = this.configService.get<string>('JWT_ACCESS_TOKEN_AMIGO');
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
      'Content-Type': 'application/json',
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
  private async fetchProjects(): Promise<ProjectData[]> {
    const response = await this.fetchData('/project/api/Project/EnterprisePageList?pageSize=-1');
    const rawProjects = response?.data?.data ?? [];
    return rawProjects.map((project: ProjectData) => ({
      id: project.id,
      name: project.name,
    }));
  }

  /**
   * Fetches all accounts for a specific project
   * @param projectId - ID of the project to fetch accounts for
   * @returns Promise with array of AccountData
   */
  private async fetchAccountInProject(projectId: string): Promise<AccountData[]> {
    const response = await this.fetchData(`/project/api/Project/Users?projectId=${projectId}&keyWord=&roleName=`);
    const rawAccounts = response?.data ?? [];
    return this.transformAndFilterAccounts(rawAccounts);
  }

  /**
   * Transforms and filters raw account data from API to match AccountData interface
   * @param data - Raw account data from API
   * @returns Array of transformed and filtered AccountData objects
   */
  private transformAndFilterAccounts(data: any[]): AccountData[] {
    return data.reduce((acc: AccountData[], u: any) => {
      u.id = u.userId;
      if (u.id && u.email && u.nickName) {
        acc.push(u);
      }
      return acc;
    }, []);
  }

  /**
   * Crawls and synchronizes project data
   * Runs every minute via cron job
   */
  @Cron('*/1 * * * * *')
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
   * Runs every minute via cron job
   */
  @Cron('*/1 * * * * *')
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
   * Manually triggers the crawling process for both projects and accounts
   */
  public async triggerCrawl(): Promise<void> {
    await this.crawlProjectData();
    await this.crawlAccountData();
  }
}

import { Controller, Post, Get, UseGuards, Query } from '@nestjs/common';
import { DataCrawlerService } from './data-crawler.service';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { JwtAccessTokenGuard } from '../auth/guards/jwt-access-token.guard';
import { GetSensorsDto } from './dto';

@ApiTags('Data Crawler')
@Controller('data-crawler')
@UseGuards(JwtAccessTokenGuard)
export class DataCrawlerController {
  constructor(private readonly dataCrawlerService: DataCrawlerService) {}

  @Post('get-access-token')
  @ApiOperation({ summary: 'Get access token by solving captcha and authenticating' })
  @ApiResponse({ status: 200, description: 'Access token retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getAccessToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.getAccessToken();
    return { accessToken };
  }

  @Get('current-access-token')
  @ApiOperation({ summary: 'Get current cached access token' })
  @ApiResponse({ status: 200, description: 'Current access token retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async getCurrentAccessToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.getCurrentAccessToken();
    return { accessToken };
  }

  @Post('force-refresh-token')
  @ApiOperation({ summary: 'Force refresh access token (bypass cache)' })
  @ApiResponse({ status: 200, description: 'Access token force refreshed successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async forceRefreshToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.forceRefreshAccessToken();
    return { accessToken };
  }

  @Get('validate-token')
  @ApiOperation({ summary: 'Validate current token and refresh if expired' })
  @ApiResponse({ status: 200, description: 'Token validated successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async validateToken(): Promise<{ accessToken: string }> {
    const accessToken = await this.dataCrawlerService.validateAndGetToken();
    return { accessToken };
  }

  @Get('sync-sensors')
  @ApiOperation({ summary: 'Get sensors from Amigo API and sync to database' })
  @ApiQuery({ name: 'projectId', description: 'Project ID to get sensors for', type: String })
  @ApiQuery({ name: 'systemType', description: 'System type filter', type: Number })
  @ApiResponse({ status: 200, description: 'Sensors synced successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async syncSensors(
    @Query() query: GetSensorsDto
  ): Promise<{ success: boolean; message: string; syncedCount: number }> {
    return await this.dataCrawlerService.getSensorsAndSync(query.projectId, query.systemType);
  }

  @Post('sync-all-projects')
  @ApiOperation({ summary: 'Get all projects from Amigo API and sync to workspace database' })
  @ApiResponse({ status: 200, description: 'Projects synced successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async syncAllProjects(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    return await this.dataCrawlerService.syncAllProjects();
  }

  @Post('sync-all-projects-and-devices')
  @ApiOperation({ summary: 'Full sync: Get all projects and their devices from Amigo API' })
  @ApiResponse({ status: 200, description: 'Full sync completed successfully' })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async syncAllProjectsAndDevices(): Promise<{ success: boolean; message: string; totalSyncedCount: number }> {
    return await this.dataCrawlerService.syncAllDevicesFromProjects();
  }

  @Get('sync-status')
  @ApiOperation({ summary: 'Get current sync status and statistics' })
  @ApiResponse({ status: 200, description: 'Sync status retrieved successfully' })
  @ApiResponse({ status: 500, description: 'Failed to get sync status' })
  async getSyncStatus(): Promise<{
    success: boolean;
    message: string;
    workspaceCount: number;
    deviceCount: number;
    locationDeviceCount: number;
    lastSyncTime?: Date;
    nextSyncTime?: Date;
  }> {
    return await this.dataCrawlerService.getSyncStatus();
  }

  @Post('sync-location-devices')
  @ApiOperation({ summary: 'Sync data for all location devices from Amigo API' })
  @ApiResponse({ status: 200, description: 'Location devices synced successfully' })
  @ApiResponse({ status: 500, description: 'Failed to sync location devices' })
  async syncLocationDevices(): Promise<{ success: boolean; message: string; syncedCount: number }> {
    return await this.dataCrawlerService.syncLocationDevicesData();
  }
}

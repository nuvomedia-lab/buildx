import { Injectable } from '@nestjs/common';
import { HelloResponseDto } from './dto/hello-response.dto';

@Injectable()
export class AppService {
  /**
   * Get application health status and basic information
   */
  getHello(): HelloResponseDto {
    return {
      message: 'Hello World!',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  /**
   * Get application information
   */
  getAppInfo() {
    return {
      name: 'BuildX API',
      version: '1.0.0',
      description: 'BuildX API with Prisma and NestJS',
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
    };
  }

  /**
   * Get application health status
   */
  getHealthStatus() {
    return {
      status: 'healthy',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      memory: process.memoryUsage(),
    };
  }
}

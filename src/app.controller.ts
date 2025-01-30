import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API is running' })
  @ApiResponse({ status: 200, description: '🚀 API is running' })
  getStatus() {
    return { status: '🚀 API is running' };
  }
}

import { Controller, Get, HttpCode, Param } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { Logger } from './entities/logger.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('logs')
export class LoggerController {
  constructor(private readonly logsService: LoggerService) {}

  @Get('')
  @ApiOperation({
    summary: 'Get all logs',
    description: `
    Get all logs of database
    Sample request:
    GET /logs`,
  })
  @ApiResponse({ status: 200, description: 'Return all logs', type: [Logger] })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @HttpCode(200)
  async getLogs(): Promise<Logger[]> {
    return await this.logsService.getLogs();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get log by id',
    description: `
    Get log by id of database
    Sample request:
    GET /logs/fec9f1f7-ccdf-414a-81c6-687fc32542d7`,
  })
  @ApiResponse({ status: 200, description: 'Return log', type: Logger })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  @ApiResponse({ status: 404, description: 'Not found' })
  @HttpCode(200)
  async getLogById(@Param('id') id: string): Promise<Logger> {
    return await this.logsService.findLog(id);
  }
}

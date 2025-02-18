import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Logger } from './entities/logger.entity';
import { ELoggerLevel } from './logger-level.enum';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { v4 as uuid } from 'uuid';

@Injectable()
export class LoggerService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  async logRequest(
    method: string,
    url: string,
    statusCode: number,
    ip: string,
    level: ELoggerLevel,
    timeRequest: number,
  ): Promise<void> {
    try {
      const log = new Logger(method, url, statusCode, level, ip, timeRequest);
      await this.elasticsearchService.index({ index: 'logs', id: uuid(), body: log });
    } catch {
      throw new InternalServerErrorException('Error saving log');
    }
  }

  async findLog(id: string): Promise<any> {
    try {
      const log = await this.elasticsearchService.get({
        index: 'logs',
        id,
      });

      if (!log) {
        throw new NotFoundException('id of log does not exists');
      }
      return log;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      throw new InternalServerErrorException('Error finding log');
    }
  }

  async getLogs(): Promise<any> {
    try {
      const logs = await this.elasticsearchService.search({
        index: 'logs',
        from: 0,
        size: 10000,
      });
      return logs;
    } catch {
      throw new InternalServerErrorException('Error finding logs');
    }
  }

  async deleteLog(id: string): Promise<void> {
    try {
      const log = await this.elasticsearchService.get({
        index: 'logs',
        id,
      });

      if (!log) throw new NotFoundException('id of log does not exists');

      await this.elasticsearchService.delete({
        index: 'logs',
        id,
      });
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException('Error deleting log');
    }
  }
}

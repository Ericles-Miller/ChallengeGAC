import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Logger } from './entities/logger.entity';
import { ELoggerLevel } from './logger-level.enum';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class LoggerService {
  constructor() {}

  async logRequest(
    method: string,
    url: string,
    statusCode: number,
    ip: string,
    level: ELoggerLevel,
    timeRequest: number,
    userAgent: string,
    referer?: string,
    userId?: string,
  ): Promise<void> {
    try {
      const log = new Logger(method, url, statusCode, ip, level, timeRequest, userAgent, referer, userId);

      const logString = JSON.stringify(log);
      fs.appendFileSync(path.join(__dirname, '../../filebeat/filebeat.yml'), logString + '\n');
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

import { Injectable, InternalServerErrorException } from '@nestjs/common';
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
}

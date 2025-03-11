import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { differenceInMilliseconds } from 'date-fns';
import { CustomLogger } from './custom-logger';
import { ELoggerLevel } from './logger-level.enum';
import * as fs from 'fs';
import * as path from 'path';

const LOG_DIR =
  process.env.NODE_ENV === 'production' ? '/usr/src/app/logstash' : path.join(__dirname, '../../logstash');

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor(private readonly customLogger: CustomLogger) {
    // Ensure log directory exists
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
  }

  async use(request: Request, response: Response, next: NextFunction): Promise<void> {
    const { method, originalUrl, ip, body, query, params } = request;
    const startTimeRequest = Date.now();

    const sanitizedBody = this.sanitizeData(body);

    response.on('finish', async () => {
      const { statusCode } = response;
      const userId = request?.user?.userId;
      const userAgent = request.headers['user-agent'];
      const referer = request.headers['referer'] || 'N/A';
      const contentLength = response.get('content-length');
      const correlationId = request.headers['x-correlation-id'] || 'N/A';

      const timeRequest = differenceInMilliseconds(startTimeRequest, Date.now());

      const level =
        statusCode >= 500 ? ELoggerLevel.ERROR : statusCode >= 400 ? ELoggerLevel.WARN : ELoggerLevel.INFO;

      const logMessage = `
      Method: ${method} 
      URL: ${originalUrl}
      Status: ${statusCode} 
      Time: ${timeRequest}ms 
      IP: ${ip} 
      User ID: ${userId || 'N/A'} 
      Correlation ID: ${correlationId} 
      User Agent: ${userAgent} 
      Referer: ${referer} 
      Query Params: ${JSON.stringify(query)} 
      Body: ${JSON.stringify(sanitizedBody)} 
      Route Params: ${JSON.stringify(params)} 
      Content Length: ${contentLength} 
      Level: ${level} 
      Headers: ${JSON.stringify(this.sanitizeHeaders(request.headers))} 
    `;

      const logData = {
        timestamp: new Date().toISOString(),
        method,
        url: originalUrl,
        status: statusCode,
        responseTime: timeRequest,
        ip,
        userId: userId || 'N/A',
        correlationId,
        userAgent,
        referer,
        queryParams: query,
        body: sanitizedBody,
        routeParams: params,
        contentLength: contentLength || 'N/A',
        level,
        headers: this.sanitizeHeaders(request.headers),
      };

      const logPath = path.join(LOG_DIR, 'my-app.log');
      fs.appendFileSync(logPath, JSON.stringify(logData) + '\n');

      if (level === ELoggerLevel.ERROR) {
        this.customLogger.error(logMessage, 'HTTP');
      } else if (level === ELoggerLevel.WARN) {
        this.customLogger.warn(logMessage, 'HTTP');
      } else if (level === ELoggerLevel.INFO) {
        this.customLogger.log(logMessage, 'HTTP');
      } else if (level === ELoggerLevel.DEBUG) {
        this.customLogger.debug(logMessage, 'HTTP');
      } else {
        this.customLogger.verbose(logMessage, 'HTTP');
      }
    });

    next();
  }

  private sanitizeData(data: any): any {
    if (!data) return data;

    const sensitiveFields = ['password', 'senha', 'token', 'authorization', 'balance'];
    const sanitized = { ...data };

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveFields.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      } else if (typeof sanitized[key] === 'object') {
        sanitized[key] = this.sanitizeData(sanitized[key]);
      }
    });

    return sanitized;
  }

  private sanitizeHeaders(headers: any): any {
    const sanitized = { ...headers };
    const sensitiveHeaders = ['authorization', 'cookie', 'x-api-key'];

    Object.keys(sanitized).forEach((key) => {
      if (sensitiveHeaders.includes(key.toLowerCase())) {
        sanitized[key] = '[REDACTED]';
      }
    });

    return sanitized;
  }
}

import { ELoggerLevel } from '../logger-level.enum';

export class Logger {
  id: string;
  method: string;
  url: string;
  statusCode: number;
  timestamp: Date;
  ip: string;
  level: ELoggerLevel;
  timeRequest: number;
  userAgent: string;
  referer?: string;
  userId?: string;

  constructor(
    method: string,
    url: string,
    statusCode: number,
    ip: string,
    level: ELoggerLevel,
    timeRequest: number,
    userAgent: string,
    referer: string,
    userId?: string,
  ) {
    this.method = method;
    this.url = url;
    this.level = level;
    this.ip = ip;
    this.timeRequest = timeRequest;
    this.statusCode = statusCode;
    this.userAgent = userAgent;
    this.referer = referer;
    this.userId = userId;
    this.timestamp = new Date();
  }
}

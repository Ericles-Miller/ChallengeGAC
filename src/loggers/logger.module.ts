import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom-logger';
import { LoggerMiddleware } from './logger-middleware';
import 'dotenv/config';
import { LoggerService } from './logger.service';

@Module({
  imports: [LoggerModule.forRoot({ pinoHttp: { level: 'trace', autoLogging: false } })],
  controllers: [],
  providers: [CustomLogger, LoggerService],
  exports: [CustomLogger, LoggerService],
})
export class LoggersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

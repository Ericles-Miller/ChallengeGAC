import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom-logger';
import { LoggerMiddleware } from './logger-middleware';
import 'dotenv/config';

@Module({
  imports: [LoggerModule.forRoot({ pinoHttp: { level: 'trace', autoLogging: false } })],
  controllers: [],
  providers: [LoggerService, CustomLogger],
  exports: [CustomLogger],
})
export class LoggersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

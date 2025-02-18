import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom-logger';
import { LoggerController } from './logger.controller';
import { LoggerMiddleware } from './logger-middleware';
import 'dotenv/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';

@Module({
  imports: [
    LoggerModule.forRoot({ pinoHttp: { level: 'trace', autoLogging: false } }),
    TypeOrmModule.forFeature([Logger]),
  ],
  controllers: [LoggerController],
  providers: [LoggerService, CustomLogger, ElasticsearchProvider, ElasticsearchService],
  exports: [CustomLogger, ElasticsearchProvider],
})
export class LoggersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

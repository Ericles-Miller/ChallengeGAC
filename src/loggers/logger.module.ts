import { MiddlewareConsumer, Module } from '@nestjs/common';
import { LoggerService } from './logger.service';
import { LoggerModule } from 'nestjs-pino';
import { CustomLogger } from './custom-logger';
import { LoggerController } from './logger.controller';
import { LoggerMiddleware } from './logger-middleware';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Logger } from './entities/logger.entity';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Module({
  imports: [
    TypeOrmModule.forFeature([Logger]),
    LoggerModule.forRoot({ pinoHttp: { level: 'trace', autoLogging: false } }),
  ],
  controllers: [LoggerController],
  providers: [
    LoggerService,
    CustomLogger,
    {
      provide: 'ELASTICSEARCH',
      useFactory: async () => {
        const { Client } = require('@elastic/elasticsearch');
        return new Client({
          node: 'http://localhost:9200', // URL do seu cluster Elasticsearch
        });
      },
    },
    ElasticsearchService,
  ],
  exports: [CustomLogger, ElasticsearchService],
})
export class LoggersModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}

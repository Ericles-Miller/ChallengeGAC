import { Test, TestingModule } from '@nestjs/testing';
import { LoggerService } from './logger.service';
import { Logger } from './entities/logger.entity';
import { ELoggerLevel } from './logger-level.enum';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

describe('LoggerService', () => {
  let service: LoggerService;
  let elasticsearchService: ElasticsearchService;

  const loggers: Logger[] = [
    {
      id: '335ecab5-4e51-4bfe-9e3b-4dd115e7a47b',
      method: 'GET',
      url: 'http://localhost:3000/logs',
      statusCode: 200,
      ip: '127.0.0.1',
      level: ELoggerLevel.INFO,
      timeRequest: 100,
      timestamp: new Date(),
    },
  ];

  const mockElastic = {
    index: jest.fn(),
    get: jest.fn(),
    search: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoggerService,
        {
          provide: ElasticsearchService,
          useValue: mockElastic,
        },
      ],
    }).compile();

    service = module.get<LoggerService>(LoggerService);
    elasticsearchService = module.get<ElasticsearchService>(ElasticsearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(elasticsearchService).toBeDefined();
  });

  describe('suite tests logRequest', () => {
    it('should be a new info log with success', async () => {
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.INFO,
        timeRequest: 100,
      };

      await service.logRequest(log.method, log.url, log.statusCode, log.ip, log.level, log.timeRequest);

      expect(elasticsearchService.index).toHaveBeenCalledTimes(1);
      expect(log.level).toBe(ELoggerLevel.INFO);
    });

    it('should be a new warn log with success', async () => {
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.WARN,
        timeRequest: 100,
        movieId: '',
      };

      await service.logRequest(log.method, log.url, log.statusCode, log.ip, log.level, log.timeRequest);

      expect(elasticsearchService.index).toHaveBeenCalledTimes(1);
      expect(log.level).toBe(ELoggerLevel.WARN);
    });

    it('should be a new error log with success', async () => {
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.ERROR,
        timeRequest: 100,
      };

      await service.logRequest(log.method, log.url, log.statusCode, log.ip, log.level, log.timeRequest);

      expect(elasticsearchService.index).toHaveBeenCalledTimes(1);
      expect(log.level).toBe(ELoggerLevel.ERROR);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(elasticsearchService, 'index').mockRejectedValue(new Error('Error saving log'));
      const log = {
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.INFO,
        timeRequest: 100,
      };

      await expect(
        service.logRequest(log.method, log.url, log.statusCode, log.ip, log.level, log.timeRequest),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('suit tests getLogs', () => {
    it('should be able to get all logs', async () => {
      jest.spyOn(elasticsearchService, 'search').mockResolvedValue(any);
      const result = await service.getLogs();

      expect(result).toEqual(loggers);
      expect(elasticsearchService.search).toHaveBeenCalledTimes(1);
    });

    it('should throw InternalServerErrorException on unexpected error', async () => {
      jest.spyOn(elasticsearchService, 'search').mockRejectedValue(new Error('Error finding log'));

      await expect(service.getLogs()).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('suit tests findLog', () => {
    it('should be able to find log by id', async () => {
      const log: Logger = {
        id: '335ecab5-4e51-4bfe-9e3b-4dd115e7a47b',
        method: 'GET',
        url: 'http://localhost:3000/logs',
        statusCode: 200,
        ip: '127.0.0.1',
        level: ELoggerLevel.INFO,
        timeRequest: 100,
        timestamp: new Date(),
      };

      jest.spyOn(elasticsearchService, 'get').mockResolvedValue();

      const result = await service.findLog('335ecab5-4e51-4bfe-9e3b-4dd115e7a47b');

      expect(result).toEqual(any);
      expect(elasticsearchService.get).toHaveBeenCalledTimes(1);
    });

    it('should throw NotFoundException on unexpected error', async () => {
      jest.spyOn(elasticsearchService, 'get').mockResolvedValue(undefined);

      await expect(service.findLog('335ecab5-4e51-4bfe-9e3b-4dd115e7a47b')).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});

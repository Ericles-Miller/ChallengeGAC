import { CustomLogger } from './custom-logger';
import { Request, Response, NextFunction } from 'express';
import { LoggerMiddleware } from './logger-middleware';
import * as fs from 'fs';

// Mock fs module
jest.mock('fs', () => ({
  appendFileSync: jest.fn(),
}));

describe('LoggerMiddleware', () => {
  let middleware: LoggerMiddleware;
  let mockCustomLogger: Partial<CustomLogger>;
  let request: Partial<Request>;
  let response: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();

    mockCustomLogger = {
      log: jest.fn(),
      warn: jest.fn(),
      error: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn(),
    };

    middleware = new LoggerMiddleware(mockCustomLogger as CustomLogger);

    request = {
      method: 'GET',
      originalUrl: '/test',
      ip: '127.0.0.1',
      params: { movieId: '123' },
      headers: {},
      query: {},
      body: {},
    };

    response = {
      statusCode: 200,
      get: jest.fn().mockReturnValue('100'),
      on: jest.fn().mockImplementation(function (this: Response, event: string, callback: () => void) {
        if (event === 'finish') callback();
        return this;
      }),
    } as Partial<Response>;

    next = jest.fn();
  });

  it('should log request information and call next', async () => {
    await middleware.use(request as Request, response as Response, next);

    expect(fs.appendFileSync).toHaveBeenCalled();
    expect(mockCustomLogger.log).toHaveBeenCalledWith(expect.stringContaining('Method: GET'), 'HTTP');
    expect(next).toHaveBeenCalled();
  });

  it('should call error log when statusCode is 500', async () => {
    response.statusCode = 500;
    await middleware.use(request as Request, response as Response, next);

    expect(fs.appendFileSync).toHaveBeenCalled();
    expect(mockCustomLogger.error).toHaveBeenCalledWith(expect.stringContaining('Status: 500'), 'HTTP');
  });

  it('should call warn log when statusCode is 400', async () => {
    response.statusCode = 400;
    await middleware.use(request as Request, response as Response, next);

    expect(fs.appendFileSync).toHaveBeenCalled();
    expect(mockCustomLogger.warn).toHaveBeenCalledWith(expect.stringContaining('Status: 400'), 'HTTP');
  });

  it('should sanitize sensitive data in headers', async () => {
    request.headers = {
      authorization: 'Bearer token123',
      cookie: 'session=123',
    };

    await middleware.use(request as Request, response as Response, next);

    const appendFileSyncCall = (fs.appendFileSync as jest.Mock).mock.calls[0][1];
    expect(appendFileSyncCall).toContain('[REDACTED]');
  });

  it('should include correlation ID if present', async () => {
    request.headers = {
      'x-correlation-id': 'test-correlation-id',
    };

    await middleware.use(request as Request, response as Response, next);

    const appendFileSyncCall = (fs.appendFileSync as jest.Mock).mock.calls[0][1];
    expect(appendFileSyncCall).toContain('test-correlation-id');
  });
});

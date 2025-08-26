import type { ExecutionContext } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { SuspiciousHeaderGuard } from './suspicious-header.guard';

const createMockExecutionContext = (requestOverrides: object = {}): jest.Mocked<ExecutionContext> => {
  const mockRequest = {
    headers: {},
    originalUrl: '/',
    ip: '127.0.0.1',
    ...requestOverrides,
  };

  return {
    getHandler: jest.fn(),
    getClass: jest.fn(),
    switchToHttp: () => ({
      getRequest: jest.fn().mockReturnValue(mockRequest),
    }),
  } as any;
};

describe('SuspiciousHeaderGuard', () => {
  let guard: SuspiciousHeaderGuard;
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
    guard = new SuspiciousHeaderGuard();
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  describe('Bypassed Paths', () => {
    it('should allow access to /health path', () => {
      const context = createMockExecutionContext({ originalUrl: '/health' });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should allow access to /metrics path', () => {
      const context = createMockExecutionContext({ originalUrl: '/metrics' });
      expect(guard.canActivate(context)).toBe(true);
    });
  });

  describe('Required Headers Validation', () => {
    it('should allow access when all required headers are present', () => {
      const context = createMockExecutionContext({
        headers: { host: 'example.com', 'user-agent': 'jest-test' },
      });
      expect(guard.canActivate(context)).toBe(true);
    });

    it('should throw BadRequestException if host header is missing', () => {
      const context = createMockExecutionContext({
        headers: { 'user-agent': 'jest-test' },
      });
      expect(() => guard.canActivate(context)).toThrow(new BadRequestException('Missing required header: host'));
    });

    it('should throw BadRequestException if user-agent header is missing', () => {
      const context = createMockExecutionContext({
        headers: { host: 'example.com' },
      });
      expect(() => guard.canActivate(context)).toThrow(new BadRequestException('Missing required header: user-agent'));
    });
  });

  describe('Verbose Logging', () => {
    let consoleDebugSpy: jest.SpyInstance;
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      process.env.NODE_ENV = 'development';
      consoleDebugSpy = jest.spyOn(console, 'debug').mockImplementation(() => {});
      consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    });

    afterEach(() => {
      consoleDebugSpy.mockRestore();
      consoleErrorSpy.mockRestore();
    });

    it('should log suspicious headers when in verbose mode', () => {
      const context = createMockExecutionContext({
        headers: {
          host: 'example.com',
          'user-agent': 'jest-test',
          'x-php-version': '8.1',
        },
      });
      guard.canActivate(context);
      expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('Suspicious header detected'));
    });

    it('should log unknown headers when in verbose mode', () => {
      const context = createMockExecutionContext({
        headers: {
          host: 'example.com',
          'user-agent': 'jest-test',
          'x-custom-unknown-header': 'value',
        },
      });
      guard.canActivate(context);
      expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('Unknown header received'));
    });

    it('should log the full header dump when debug mode is enabled', () => {
      process.env.HEADER_GUARD_DEBUG = 'true';
      const context = createMockExecutionContext({
        headers: { host: 'example.com', 'user-agent': 'jest-test' },
      });
      guard.canActivate(context);
      expect(consoleDebugSpy).toHaveBeenCalledWith(expect.stringContaining('Full header dump'), expect.any(Object));
    });

    it('should log an error when a request is blocked', () => {
      const context = createMockExecutionContext({ headers: {} });
      try {
        guard.canActivate(context);
      } catch (err) {
        /* empty */
      }
      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Blocked by guard'), expect.any(String));
    });

    it('should log a non-Error object if one is thrown', () => {
      const errorString = 'A simple string error';
      jest.spyOn(guard as any, 'validateRequiredHeaders').mockImplementation(() => {
        // eslint-disable-next-line @typescript-eslint/only-throw-error
        throw errorString;
      });

      const context = createMockExecutionContext();

      try {
        guard.canActivate(context);
      } catch (err) {
        // Expected to throw
      }

      expect(consoleErrorSpy).toHaveBeenCalledWith(expect.stringContaining('Blocked by guard'), errorString);
    });
  });
});

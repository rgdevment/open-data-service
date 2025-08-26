import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { TooManyRequestsException } from '@libs/common';
import type { ExecutionContext } from '@nestjs/common';
import { RateLimitGuard } from './rate-limit.guard';

const createMockExecutionContext = (requestOverrides: object = {}): jest.Mocked<ExecutionContext> => {
  const mockRequest = {
    ip: '127.0.0.1',
    originalUrl: '/test',
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

const mockCacheManager: jest.Mocked<Cache> = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
  wrap: jest.fn(),
  store: {} as any,
};

describe('RateLimitGuard', () => {
  let guard: RateLimitGuard;
  let cache: Cache;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RateLimitGuard,
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    guard = module.get<RateLimitGuard>(RateLimitGuard);
    cache = module.get<Cache>('CACHE_MANAGER');
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(guard).toBeDefined();
  });

  it('should allow the request and set count to 1 if it is the first request', async () => {
    const context = createMockExecutionContext();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    jest.mocked(cache.get).mockResolvedValue(undefined);

    const canActivate = await guard.canActivate(context);

    expect(canActivate).toBe(true);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(cache.set).toHaveBeenCalledWith('rate-limit:127.0.0.1:/test', 1, { ttl: 60 });
  });

  it('should allow the request and increment the count if within the limit', async () => {
    const context = createMockExecutionContext();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    jest.mocked(cache.get).mockResolvedValue(10);

    const canActivate = await guard.canActivate(context);

    expect(canActivate).toBe(true);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(cache.set).toHaveBeenCalledWith('rate-limit:127.0.0.1:/test', 11, { ttl: 60 });
  });

  it('should throw TooManyRequestsException if the rate limit is exceeded', async () => {
    const context = createMockExecutionContext();
    // eslint-disable-next-line @typescript-eslint/unbound-method
    jest.mocked(cache.get).mockResolvedValue(20);

    await expect(guard.canActivate(context)).rejects.toThrow(TooManyRequestsException);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(cache.set).not.toHaveBeenCalled();
  });
});

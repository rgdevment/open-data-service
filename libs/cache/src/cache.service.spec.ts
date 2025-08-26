import type { TestingModule } from '@nestjs/testing';
import { Test } from '@nestjs/testing';
import type { Cache } from 'cache-manager';
import { RedisCacheService } from './cache.service';

const mockCacheManager: jest.Mocked<Cache> = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  reset: jest.fn(),
  wrap: jest.fn(),
  store: {} as any,
};

describe('RedisCacheService', () => {
  let service: RedisCacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisCacheService,
        {
          provide: 'CACHE_MANAGER',
          useValue: mockCacheManager,
        },
      ],
    }).compile();

    service = module.get<RedisCacheService>(RedisCacheService);
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return the cached value if it exists', async () => {
      const cachedValue = { id: 1, name: 'test' };
      mockCacheManager.get.mockResolvedValue(cachedValue);

      const result = await service.get('my-key');

      expect(result).toEqual(cachedValue);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockCacheManager.get).toHaveBeenCalledWith('my-key');
    });

    it('should return null if the value does not exist in cache', async () => {
      mockCacheManager.get.mockResolvedValue(undefined);

      const result = await service.get('my-key');

      expect(result).toBeNull();
    });
  });

  describe('set', () => {
    it('should set a value in the cache with the default TTL', async () => {
      const key = 'my-key';
      const value = 'my-value';

      await service.set(key, value);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, { ttl: 60 });
    });

    it('should set a value in the cache with a custom TTL', async () => {
      const key = 'my-key';
      const value = 'my-value';
      const ttl = 300;

      await service.set(key, value, ttl);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockCacheManager.set).toHaveBeenCalledWith(key, value, { ttl });
    });
  });

  describe('del', () => {
    it('should delete a value from the cache', async () => {
      const key = 'my-key';
      await service.del(key);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockCacheManager.del).toHaveBeenCalledWith(key);
    });
  });

  describe('reset', () => {
    it('should reset the cache', async () => {
      await service.reset();
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(mockCacheManager.reset).toHaveBeenCalled();
    });
  });
});

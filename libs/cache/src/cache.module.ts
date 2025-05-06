import { Global, Module } from '@nestjs/common';
import { caching, Store } from 'cache-manager';
import * as redisStore from 'cache-manager-redis-store';
import { RedisCacheInterceptor } from './cache.interceptor';
import { RedisCacheService } from './cache.service';

@Global()
@Module({
  providers: [
    {
      provide: 'CACHE_MANAGER',
      useFactory: () => {
        return caching({
          store: redisStore as Store,
          host: process.env.REDIS_HOST || 'redis',
          port: parseInt(process.env.REDIS_PORT || '6379', 10),
          ttl: 7200,
        });
      },
    },
    RedisCacheService,
    RedisCacheInterceptor,
  ],
  exports: ['CACHE_MANAGER', RedisCacheService, RedisCacheInterceptor],
})
export class RedisCacheModule {}

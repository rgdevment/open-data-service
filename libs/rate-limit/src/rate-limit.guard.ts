import { CanActivate, ExecutionContext, Inject, Injectable } from '@nestjs/common';

import { Cache } from 'cache-manager';
import { TooManyRequestsException } from './exceptions/many-request.exceptions';

@Injectable()
export class RateLimitGuard implements CanActivate {
  maxRequests: number;
  ttl: number;

  constructor(@Inject('CACHE_MANAGER') private readonly cache: Cache) {
    this.maxRequests = 20;
    this.ttl = 60;
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const key = `rate-limit:${req.ip}:${req.originalUrl}`;

    const current = await this.cache.get<number>(key);

    if (current && current >= this.maxRequests) {
      throw new TooManyRequestsException('Rate limit exceeded');
    }

    await this.cache.set(key, (current ?? 0) + 1, { ttl: this.ttl });

    return true;
  }
}

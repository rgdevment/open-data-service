import { CallHandler, ExecutionContext, Inject, Injectable, NestInterceptor } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class RedisCacheInterceptor implements NestInterceptor {
  constructor(@Inject('CACHE_MANAGER') private readonly cache: Cache) {}

  async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
    const req: { originalUrl: string } = context.switchToHttp().getRequest();
    const key = req.originalUrl;

    const cached = await this.cache.get<unknown>(key);

    if (cached) {
      return of(cached);
    }

    return next.handle().pipe(
      tap((response) => {
        void this.cache.set(key, response, { ttl: 7200 });
      }),
    );
  }
}

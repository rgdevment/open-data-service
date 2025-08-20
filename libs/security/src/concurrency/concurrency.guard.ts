import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConcurrencyService } from './concurrency.service';
import { TooManyRequestsException } from '@libs/common';

@Injectable()
export class ConcurrencyGuard implements CanActivate {
  constructor(private readonly concurrency: ConcurrencyService) {}

  canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const ip = req.ip;

    if (!this.concurrency.enter(ip)) {
      throw new TooManyRequestsException('Too many concurrent requests');
    }

    const res = context.switchToHttp().getResponse();
    res.on('finish', () => this.concurrency.exit(ip));
    res.on('close', () => this.concurrency.exit(ip));

    return Promise.resolve(true);
  }
}

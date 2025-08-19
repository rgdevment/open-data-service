import { Module } from '@nestjs/common';
import { ConcurrencyGuard } from './concurrency/concurrency.guard';
import { ConcurrencyService } from './concurrency/concurrency.service';
import { SuspiciousHeaderGuard } from './headers/suspicious-header.guard';
import { HoneypotMiddleware } from './honeypots/honeypot.middleware';
import { BodySizeLimiterMiddleware } from './payload-guard/body-size-limiter.middleware';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { BotDetectorMiddleware } from './user-agent/bot-detector.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
  providers: [
    BotDetectorMiddleware,
    RateLimitGuard,
    ConcurrencyService,
    ConcurrencyGuard,
    SuspiciousHeaderGuard,
    BodySizeLimiterMiddleware,
    HoneypotMiddleware,
    AuthModule,
  ],
  exports: [
    BotDetectorMiddleware,
    RateLimitGuard,
    ConcurrencyGuard,
    SuspiciousHeaderGuard,
    BodySizeLimiterMiddleware,
    HoneypotMiddleware,
    AuthModule,
  ],
})
export class SecurityModule {}

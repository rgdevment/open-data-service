import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule } from './auth/auth.module';
import { ConcurrencyGuard } from './concurrency/concurrency.guard';
import { ConcurrencyService } from './concurrency/concurrency.service';
import { SuspiciousHeaderGuard } from './headers/suspicious-header.guard';
import { HoneypotMiddleware } from './honeypots/honeypot.middleware';
import { BodySizeLimiterMiddleware } from './payload-guard/body-size-limiter.middleware';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { BotDetectorMiddleware } from './user-agent/bot-detector.middleware';

@Module({
  imports: [AuthModule],
  providers: [
    BotDetectorMiddleware,
    RateLimitGuard,
    ConcurrencyService,
    ConcurrencyGuard,
    SuspiciousHeaderGuard,
    BodySizeLimiterMiddleware,
    HoneypotMiddleware,
    {
      provide: APP_GUARD,
      useClass: SuspiciousHeaderGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ConcurrencyGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RateLimitGuard,
    },
  ],
  exports: [
    AuthModule,
    BotDetectorMiddleware,
    RateLimitGuard,
    ConcurrencyGuard,
    SuspiciousHeaderGuard,
    BodySizeLimiterMiddleware,
    HoneypotMiddleware,
  ],
})
export class SecurityModule {}

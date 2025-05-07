import { Module } from '@nestjs/common';
import { ConcurrencyGuard } from './concurrency/concurrency.guard';
import { ConcurrencyService } from './concurrency/concurrency.service';
import { SuspiciousHeaderGuard } from './headers/suspicious-header.guard';
import { RateLimitGuard } from './rate-limit/rate-limit.guard';
import { BotDetectorMiddleware } from './user-agent/bot-detector.middleware';

@Module({
  providers: [BotDetectorMiddleware, RateLimitGuard, ConcurrencyService, ConcurrencyGuard, SuspiciousHeaderGuard],
  exports: [BotDetectorMiddleware, RateLimitGuard, ConcurrencyGuard, SuspiciousHeaderGuard],
})
export class SecurityModule {}

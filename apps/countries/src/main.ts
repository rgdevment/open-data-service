import { BotDetectorMiddleware, ConcurrencyGuard, RateLimitGuard, SuspiciousHeaderGuard } from '@libs/security';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  process.env.DB_NAME_ENV = 'COUNTRIES_DB';

  const app = await NestFactory.create(AppModule);

  const rateLimiter = app.get(RateLimitGuard);
  const botMiddleware = app.get(BotDetectorMiddleware);
  const concurrencyGuard = app.get(ConcurrencyGuard);
  const headerGuard = app.get(SuspiciousHeaderGuard);

  app.useGlobalGuards(headerGuard);
  app.useGlobalGuards(concurrencyGuard);
  app.use(botMiddleware.use.bind(botMiddleware));
  app.useGlobalGuards(rateLimiter);

  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

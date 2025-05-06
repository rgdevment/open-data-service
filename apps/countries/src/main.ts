import { NestFactory } from '@nestjs/core';
import { RateLimitGuard } from 'libs/rate-limit/src/rate-limit.guard';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  process.env.DB_NAME_ENV = 'COUNTRIES_DB';

  const app = await NestFactory.create(AppModule);

  const guard = await app.select(AppModule).resolve(RateLimitGuard);
  app.useGlobalGuards(guard);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

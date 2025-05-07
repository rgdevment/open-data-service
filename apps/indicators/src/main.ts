import { RateLimitGuard } from '@libs/rate-limit';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';

async function bootstrap(): Promise<void> {
  process.env.DB_NAME_ENV = 'INDICATORS_DB';

  const app = await NestFactory.create(AppModule);

  const guard = await app.select(AppModule).resolve(RateLimitGuard);

  app.useGlobalGuards(guard);
  setupSwagger(app);

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

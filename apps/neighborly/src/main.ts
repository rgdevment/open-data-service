import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { setupSwagger } from './swagger';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';

async function bootstrap(): Promise<void> {
  process.env.DB_NAME_ENV = 'NEIGHBORLY_DB';

  const app = await NestFactory.create(AppModule);
  setupSwagger(app);
  app.useGlobalPipes(new ValidationPipe());
  app.use(cookieParser());

  await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();

import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { HealthModule } from '@libs/health';
import { PrometheusModule } from '@libs/prometheus';
import { SecurityModule, BodySizeLimiterMiddleware, BotDetectorMiddleware, HoneypotMiddleware } from '@libs/security';
import { CountriesModule } from './modules/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule,
    DatabaseModule,
    HealthModule,
    CountriesModule,
    RedisCacheModule,
    SecurityModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BodySizeLimiterMiddleware, BotDetectorMiddleware, HoneypotMiddleware).forRoutes('*');
  }
}

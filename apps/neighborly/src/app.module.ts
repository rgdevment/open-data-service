import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { HealthModule } from '@libs/health';
import { PrometheusModule } from '@libs/prometheus';
import {
  BodySizeLimiterMiddleware,
  BotDetectorMiddleware,
  HoneypotMiddleware,
  JwtAuthGuard,
  RolesGuard,
  SecurityModule,
} from '@libs/security';
import { AppController } from './app.controller';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    SecurityModule,
    PrometheusModule,
    DatabaseModule,
    HealthModule,
    RedisCacheModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BodySizeLimiterMiddleware, BotDetectorMiddleware, HoneypotMiddleware).forRoutes('*');
  }
}

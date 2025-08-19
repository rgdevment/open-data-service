import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { HealthModule } from '@libs/health';
import { PrometheusModule } from '@libs/prometheus';
import { JwtAuthGuard, RolesGuard, SecurityModule } from '@libs/security';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/neighborly/.env.development',
    }),
    SecurityModule,
    PrometheusModule,
    DatabaseModule,
    HealthModule,
    RedisCacheModule,
    SecurityModule,
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
  exports: [],
})
export class AppModule {}

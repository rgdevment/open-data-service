import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { HealthModule } from '@libs/health';
import { PrometheusModule } from '@libs/prometheus';
import { SecurityModule } from '@libs/security';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule,
    DatabaseModule,
    HealthModule,
    RedisCacheModule,
    SecurityModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

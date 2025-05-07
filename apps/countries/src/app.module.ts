import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { HealthModule } from '@libs/health';
import { PrometheusModule } from '@libs/prometheus';
import { RateLimitModule } from '@libs/rate-limit';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { CountriesModule } from './modules/countries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule,
    DatabaseModule,
    HealthModule,
    CountriesModule,
    RedisCacheModule,
    RateLimitModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

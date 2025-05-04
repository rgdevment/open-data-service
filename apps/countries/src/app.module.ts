import { HealthModule } from '@libs/health';
import { PrometheusModule } from '@libs/prometheus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from 'libs/database';
import { CountriesModule } from './modules/countries.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrometheusModule, DatabaseModule, HealthModule, CountriesModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

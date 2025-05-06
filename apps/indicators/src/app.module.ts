import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { PrometheusModule } from '@libs/prometheus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AfpModule } from './modules/afps/afp.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { EconomicsModule } from './modules/economics/economics.module';
import { SalariesModule } from './modules/salaries/salaries.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrometheusModule,
    DatabaseModule,
    CurrenciesModule,
    EconomicsModule,
    SalariesModule,
    AfpModule,
    RedisCacheModule,
  ],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

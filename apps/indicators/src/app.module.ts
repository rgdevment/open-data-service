import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RedisCacheModule } from '@libs/cache';
import { DatabaseModule } from '@libs/database';
import { PrometheusModule } from '@libs/prometheus';
import { SecurityModule, BodySizeLimiterMiddleware, BotDetectorMiddleware, HoneypotMiddleware } from '@libs/security';
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
    SecurityModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(BodySizeLimiterMiddleware, BotDetectorMiddleware, HoneypotMiddleware).forRoutes('*');
  }
}

import { PrometheusModule } from '@libs/prometheus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrometheusModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

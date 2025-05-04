import { DatabaseModule } from '@libs/database';
import { PrometheusModule } from '@libs/prometheus';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), PrometheusModule, DatabaseModule],
  controllers: [],
  providers: [],
  exports: [],
})
export class AppModule {}

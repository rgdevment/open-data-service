import { Module } from '@nestjs/common';
import { createPrometheusRegistry } from './prometheus.provider';
import { MetricsController } from './metrics.controller';

@Module({
  providers: [
    {
      provide: 'PrometheusRegistry',
      useValue: createPrometheusRegistry(),
    },
  ],
  controllers: [MetricsController],
  exports: ['PrometheusRegistry'],
})
export class PrometheusModule {}

import { Module } from '@nestjs/common';
import { createPrometheusRegistry } from './prometheus.provider';

@Module({
  providers: [
    {
      provide: 'PrometheusRegistry',
      useValue: createPrometheusRegistry(),
    },
  ],
  controllers: [],
  exports: ['PrometheusRegistry'],
})
export class PrometheusModule {}

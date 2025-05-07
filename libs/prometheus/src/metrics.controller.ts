import { Controller, Get, Inject } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import * as console from 'node:console';
import { Registry } from 'prom-client';

@ApiExcludeController()
@Controller()
export class MetricsController {
  constructor(@Inject('PrometheusRegistry') private readonly registry: Registry) {}

  @Get('/metrics')
  async getMetrics(): Promise<string> {
    console.log('Metrics endpoint hit');
    return this.registry.metrics();
  }
}

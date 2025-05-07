import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly health: HealthCheckService) {}

  @Get()
  @HealthCheck()
  @ApiOperation({
    summary: 'Check service health',
    description: 'Returns a simple health status for the service.',
  })
  @ApiResponse({
    status: 200,
    description: 'The service is healthy and running.',
    schema: {
      example: {
        status: 'ok',
        info: {
          app: { status: 'up' },
        },
        error: {},
        details: {
          app: { status: 'up' },
        },
      },
    },
  })
  check(): Promise<any> {
    return this.health.check([() => ({ app: { status: 'up' } })]);
  }
}

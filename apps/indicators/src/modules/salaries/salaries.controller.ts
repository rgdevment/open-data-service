import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { RedisCacheInterceptor } from 'libs/cache/src/cache.interceptor';
import { SalaryResponseDto } from './dto/salary.response.dto';
import { SalariesService } from './salaries.service';

@Controller('v1/salario')
@UseInterceptors(RedisCacheInterceptor)
export class SalariesController {
  constructor(private readonly service: SalariesService) {}

  @Get('base')
  async getMinimumWage(): Promise<SalaryResponseDto> {
    return this.service.retrieveMinimumWage();
  }
}

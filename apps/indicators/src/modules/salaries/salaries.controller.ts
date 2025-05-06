import { Controller, Get } from '@nestjs/common';
import { SalariesService } from './salaries.service';

@Controller('v1/salario')
export class SalariesController {
  constructor(private readonly service: SalariesService) {}

  @Get('base')
  async getMinimumWage(): Promise<any> {
    return this.service.retrieveMinimumWage();
  }
}

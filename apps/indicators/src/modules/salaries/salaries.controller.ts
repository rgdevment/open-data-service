import { Controller, Get } from '@nestjs/common';
import { SalaryResponseDto } from './dto/salary.response.dto';
import { SalariesService } from './salaries.service';

@Controller('v1/salario')
export class SalariesController {
  constructor(private readonly service: SalariesService) {}

  @Get('base')
  async getMinimumWage(): Promise<SalaryResponseDto> {
    return this.service.retrieveMinimumWage();
  }
}

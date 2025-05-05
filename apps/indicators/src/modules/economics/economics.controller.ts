import { Controller, Get, Param } from '@nestjs/common';
import { EconomicsService } from './economics.service';
import { EconomicsEnum } from './enums/economics.enum';
import { EconomicsParsePipe } from './validators/economics-parse.pipe';

@Controller('v1/economics')
export class EconomicsController {
  constructor(private readonly service: EconomicsService) {}

  @Get(':indicator')
  getIndicator(@Param('indicator', EconomicsParsePipe) indicator: EconomicsEnum): Promise<any> {
    return this.service.getIndicator(indicator);
  }
}

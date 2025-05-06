import { Controller, Get, Param } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrenciesEnum } from './enums/currencies.enum';
import { CurrenciesParsePipe } from './validators/currencies-parse.pipe';

@Controller('v1/divisas')
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get(':currency')
  async getCurrency(@Param('currency', CurrenciesParsePipe) currency: CurrenciesEnum): Promise<any> {
    return this.service.retrieveDetailsCurrencyIndicator(currency);
  }
}

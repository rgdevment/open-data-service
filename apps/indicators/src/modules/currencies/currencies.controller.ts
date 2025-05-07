import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CurrenciesService } from './currencies.service';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { CurrenciesEnum } from './enums/currencies.enum';
import { CurrenciesParsePipe } from './validators/currencies-parse.pipe';
import { RedisCacheInterceptor } from '@libs/cache';

@Controller('v1/divisa')
@UseInterceptors(RedisCacheInterceptor)
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get(':currency')
  async getCurrency(@Param('currency', CurrenciesParsePipe) currency: CurrenciesEnum): Promise<CurrencyResponseDto> {
    return this.service.retrieveDetailsCurrencyIndicator(currency);
  }
}

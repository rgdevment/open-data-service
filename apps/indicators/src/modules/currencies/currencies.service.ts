import { Injectable, NotFoundException } from '@nestjs/common';
import { IndicatorValueDto } from '../../common/dto/indicator-value.dto';
import { CurrenciesRepository } from './currencies.repository';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { CurrenciesEnum } from './enums/currencies.enum';

@Injectable()
export class CurrenciesService {
  constructor(private readonly repository: CurrenciesRepository) {}

  private toDto(value: any): IndicatorValueDto {
    if (!value) throw new NotFoundException('Currency record not found');
    return new IndicatorValueDto(new Date(value.recorded_date), value.value, value.value_to_word);
  }

  async retrieveDetailsCurrencyIndicator(currency: CurrenciesEnum): Promise<CurrencyResponseDto> {
    const currentValue = await this.repository.findCurrentOrLastDayRecord(currency);
    const firstOfMonth = await this.repository.findFirstRecordOfMonth(currency, new Date());
    const average = await this.repository.calculateAverageValueOfMonth(currency, new Date());

    return new CurrencyResponseDto({
      currency,
      average: average ?? undefined,
      records: [this.toDto(currentValue), this.toDto(firstOfMonth)],
    });
  }
}

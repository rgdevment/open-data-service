import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { CurrenciesEnum } from '../enums/currencies.enum';

@Injectable()
export class CurrenciesParsePipe implements PipeTransform<string, CurrenciesEnum> {
  transform(value: string): CurrenciesEnum {
    const enumValue = value.toUpperCase() as unknown as CurrenciesEnum;

    if (!Object.values(CurrenciesEnum).includes(enumValue)) {
      const message = `${value} is not an admitted or supported currency by our API.`;
      Logger.log(message, 'CurrencyParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

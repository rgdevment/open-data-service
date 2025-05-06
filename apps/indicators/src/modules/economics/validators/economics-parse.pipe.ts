import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { EconomicsEnum } from '../enums/economics.enum';

@Injectable()
export class EconomicsParsePipe implements PipeTransform<string, EconomicsEnum> {
  transform(value: string): EconomicsEnum {
    const enumValue = value.toUpperCase() as unknown as EconomicsEnum;

    if (!Object.values(EconomicsEnum).includes(enumValue)) {
      const message = `${value} is not an admitted or supported indicator by our API.`;
      Logger.log(message, 'EconomicsParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

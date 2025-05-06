import { BadRequestException, Injectable, Logger, PipeTransform } from '@nestjs/common';
import { AfpEnum } from '../enums/afp.enum';
@Injectable()
export class AfpParsePipe implements PipeTransform<string, AfpEnum> {
  transform(value: string): AfpEnum {
    const enumValue = value.toUpperCase() as unknown as AfpEnum;

    if (!Object.values(AfpEnum).includes(enumValue)) {
      const message = `Invalid AFP value: ${value}. Valid values are: ${Object.values(AfpEnum).join(', ')}`;
      Logger.log(message, 'IndicatorsParsePipe');
      throw new BadRequestException(message);
    }

    return enumValue;
  }
}

import type { IndicatorValueDto } from '../../../common/dto/indicator-value.dto';

export class CurrencyResponseDto {
  currency!: string;
  average!: number;
  records!: IndicatorValueDto[];

  constructor(partial: Partial<CurrencyResponseDto>) {
    Object.assign(this, partial);
  }
}

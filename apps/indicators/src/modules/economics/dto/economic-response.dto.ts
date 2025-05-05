import type { IndicatorValueDto } from '../../../common/dto/indicator-value.dto';

export class EconomicResponseDto {
  indicator!: string;
  average!: number;
  accumulated!: number;
  accumulatedYearly!: number;
  records!: IndicatorValueDto[];

  constructor(partial: Partial<EconomicResponseDto>) {
    Object.assign(this, partial);
  }
}

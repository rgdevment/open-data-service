import { Injectable, NotFoundException } from '@nestjs/common';
import { IndicatorValueDto } from '../../common/dto/indicator-value.dto';
import { EconomicResponseDto } from './dto/economic-response.dto';
import { EconomicsRepository } from './economics.repository';
import { EconomicsEnum } from './enums/economics.enum';

@Injectable()
export class EconomicsService {
  private readonly strategies: Record<EconomicsEnum, () => Promise<EconomicResponseDto>>;

  constructor(private readonly repository: EconomicsRepository) {
    this.strategies = {
      [EconomicsEnum.UF]: () => this.ufStrategy(),
      [EconomicsEnum.UTM]: () => this.simpleStrategy(EconomicsEnum.UTM),
      [EconomicsEnum.IPC]: () => this.ipcStrategy(),
    };
  }

  async getIndicator(indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    const strategy = this.strategies[indicator];
    if (!strategy) throw new NotFoundException(`Strategy not implemented for ${indicator}`);
    return strategy();
  }

  private async ufStrategy(): Promise<EconomicResponseDto> {
    const now = new Date();
    const [current, first, last, average] = await Promise.all([
      this.repository.findCurrentOrLastDayRecord(EconomicsEnum.UF),
      this.repository.findFirstRecordOfMonth(EconomicsEnum.UF, now),
      this.repository.findLastRecordOfMonth(EconomicsEnum.UF, now),
      this.repository.calculateAverageValueOfMonth(EconomicsEnum.UF, now),
    ]);

    return new EconomicResponseDto({
      indicator: EconomicsEnum.UF,
      average: average ?? undefined,
      records: [
        this.toDto(current, EconomicsEnum.UF),
        this.toDto(first, EconomicsEnum.UF),
        this.toDto(last, EconomicsEnum.UF),
      ],
    });
  }

  private async ipcStrategy(): Promise<EconomicResponseDto> {
    const [current, accYear, acc12] = await Promise.all([
      this.repository.findCurrentOrLastDayRecord(EconomicsEnum.IPC),
      this.repository.calculateYearlyAccumulatedValue(EconomicsEnum.IPC),
      this.repository.calculateAccumulatedValueLast12Months(EconomicsEnum.IPC),
    ]);

    return new EconomicResponseDto({
      indicator: EconomicsEnum.IPC,
      accumulated: accYear ?? undefined,
      accumulatedYearly: acc12 ?? undefined,
      records: [this.toDto(current, EconomicsEnum.IPC)],
    });
  }

  private async simpleStrategy(indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    const current = await this.repository.findCurrentOrLastDayRecord(indicator);
    return new EconomicResponseDto({
      indicator,
      records: [this.toDto(current, indicator)],
    });
  }

  private toDto(entity: any, code: string): IndicatorValueDto {
    if (!entity) {
      throw new NotFoundException(`Indicator record not found for ${code}`);
    }

    return new IndicatorValueDto(new Date(entity.recorded_date), entity.value, entity.value_to_word ?? '');
  }
}

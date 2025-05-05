import { Injectable, NotFoundException } from '@nestjs/common';
import { IndicatorValueEntity } from '../../common/entities/indicator-value.entity';
import { SalaryEntryDto } from './dto/salary-entry.dto';
import { SalaryResponseDto } from './dto/salary.response.dto';
import { SalariesRepository } from './salaries.repository';

@Injectable()
export class SalariesService {
  constructor(private readonly repository: SalariesRepository) {}

  async retrieveMinimumWage(): Promise<SalaryResponseDto> {
    const records = await this.repository.findAllSortedByDate();

    if (!records.length) {
      throw new NotFoundException('No wage records found');
    }

    const [current, ...historic] = records;

    return new SalaryResponseDto({
      current: this.toDto(current),
      historic: historic.map(this.toDto),
    });
  }

  private readonly toDto = (record: IndicatorValueEntity): SalaryEntryDto => {
    return new SalaryEntryDto({
      amount: record.value,
      details: record.value_to_word,
      range: record.subtype.name,
      date: record.recorded_date,
    });
  };
}

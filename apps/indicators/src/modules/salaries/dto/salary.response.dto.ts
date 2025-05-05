import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { SalaryEntryDto } from './salary-entry.dto';

export class SalaryResponseDto {
  @ValidateNested()
  @Type(() => SalaryEntryDto)
  current!: SalaryEntryDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryEntryDto)
  historic!: SalaryEntryDto[];

  constructor(partial: Partial<SalaryResponseDto>) {
    Object.assign(this, partial);
  }
}

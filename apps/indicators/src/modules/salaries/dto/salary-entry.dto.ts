import { DateOnlyTransform } from 'apps/indicators/src/utils/date-only.transform';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsString } from 'class-validator';

export class SalaryEntryDto {
  @IsInt()
  amount!: number;

  @IsString()
  details!: string;

  @IsString()
  range!: string;

  @IsDateString()
  @Transform(DateOnlyTransform)
  date!: string;

  constructor(partial: Partial<SalaryEntryDto>) {
    Object.assign(this, partial);
  }
}

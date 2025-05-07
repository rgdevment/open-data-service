import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsString } from 'class-validator';
import { DateOnlyTransform } from '../../../utils/date-only.transform';

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

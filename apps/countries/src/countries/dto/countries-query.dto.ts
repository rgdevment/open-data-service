import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, Min, ValidateIf } from 'class-validator';

export class CountriesQueryDto {
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  excludeStates: boolean = false;

  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  excludeCities: boolean = false;

  @ValidateIf((o) => !o.excludeCities)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @ValidateIf((o) => !o.excludeCities)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number;
}

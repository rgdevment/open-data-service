import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsBoolean, IsInt, Min, ValidateIf } from 'class-validator';

export class CountriesQueryDto {
  @ApiPropertyOptional({
    type: Boolean,
    description: 'Exclude states from the response',
    default: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  excludeStates: boolean = false;

  @ApiPropertyOptional({
    type: Boolean,
    description: 'Exclude cities from the response',
    default: false,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  excludeCities: boolean = false;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    description: 'Page number for pagination (only applies if cities are included)',
    example: 1,
  })
  @ValidateIf((o) => !o.excludeCities)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({
    type: Number,
    minimum: 1,
    description: 'Limit of results per page (only applies if cities are included)',
    example: 10,
  })
  @ValidateIf((o) => !o.excludeCities)
  @Transform(({ value }) => parseInt(value, 10))
  @IsInt()
  @Min(1)
  limit?: number;
}

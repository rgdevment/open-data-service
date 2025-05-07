import { ApiProperty } from '@nestjs/swagger';
import { CountryDto } from './country.dto';

export class PaginatedCountryResponseDto {
  @ApiProperty({ type: [CountryDto] })
  data!: CountryDto[];

  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;
}

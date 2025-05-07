import { ApiProperty } from '@nestjs/swagger';
import { CityDto } from './city-query.dto';
import { StateDto } from './state.dto';

export class CountryDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  code!: string;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  capital?: string;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty({ required: false })
  phone_code?: string;

  @ApiProperty({ required: false })
  region?: string;

  @ApiProperty({ required: false })
  subregion?: string;

  @ApiProperty({ required: false })
  tld?: string;

  @ApiProperty({ required: false })
  currency_code?: string;

  @ApiProperty({ required: false })
  currency_symbol?: string;

  @ApiProperty({ required: false })
  currency_name?: string;

  @ApiProperty({ required: false })
  flag_ico?: string;

  @ApiProperty({ required: false })
  flag_alt?: string;

  @ApiProperty({ required: false })
  flag_png?: string;

  @ApiProperty({ required: false })
  flag_svg?: string;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ type: () => [StateDto], required: false })
  states?: StateDto[];

  @ApiProperty({ type: () => [CityDto], required: false })
  cities?: CityDto[];
}

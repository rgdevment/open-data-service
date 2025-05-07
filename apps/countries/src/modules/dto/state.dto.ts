// state.dto.ts
import { ApiProperty } from '@nestjs/swagger';
import { CityDto } from './city-query.dto';

export class StateDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty({ required: false })
  code?: string;

  @ApiProperty()
  country_id!: number;

  @ApiProperty({ required: false })
  latitude?: number;

  @ApiProperty({ required: false })
  longitude?: number;

  @ApiProperty()
  created_at!: Date;

  @ApiProperty()
  updated_at!: Date;

  @ApiProperty({ type: () => [CityDto], required: false })
  cities?: CityDto[];
}

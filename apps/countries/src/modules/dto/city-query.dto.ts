// city.dto.ts
import { ApiProperty } from '@nestjs/swagger';

export class CityDto {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  name!: string;

  @ApiProperty()
  state_id!: number;

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
}

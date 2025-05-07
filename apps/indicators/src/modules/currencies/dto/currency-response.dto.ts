import { ApiProperty } from '@nestjs/swagger';
import { IndicatorValueDto } from '../../../common/dto/indicator-value.dto';

export class CurrencyResponseDto {
  @ApiProperty({ example: 'EURO', description: 'Código de la divisa consultada' })
  currency!: string;

  @ApiProperty({ example: 1350.78, description: 'Promedio mensual calculado para la divisa' })
  average!: number;

  @ApiProperty({
    type: [IndicatorValueDto],
    description: 'Registros históricos de la divisa, ordenados por fecha',
  })
  records!: IndicatorValueDto[];

  constructor(partial: Partial<CurrencyResponseDto>) {
    Object.assign(this, partial);
  }
}

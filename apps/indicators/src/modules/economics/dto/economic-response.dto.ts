import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IndicatorValueDto } from '../../../common/dto/indicator-value.dto';

export class EconomicResponseDto {
  @ApiProperty({ example: 'UF', description: 'Nombre o código del indicador económico' })
  indicator!: string;

  @ApiPropertyOptional({ example: 37849.91, description: 'Promedio mensual del indicador (si aplica)' })
  average?: number;

  @ApiPropertyOptional({ example: 3.2, description: 'Variación acumulada mensual del indicador (IPC)' })
  accumulated?: number;

  @ApiPropertyOptional({ example: 12.5, description: 'Acumulado anual del indicador (IPC)' })
  accumulatedYearly?: number;

  @ApiProperty({
    type: [IndicatorValueDto],
    description: 'Registros históricos del indicador',
  })
  records!: IndicatorValueDto[];

  constructor(partial: Partial<EconomicResponseDto>) {
    Object.assign(this, partial);
  }
}

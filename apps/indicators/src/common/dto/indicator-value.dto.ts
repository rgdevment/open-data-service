import { ApiProperty } from '@nestjs/swagger';

export class IndicatorValueDto {
  @ApiProperty({ example: '2025-05-07', description: 'Fecha del valor en formato YYYY-MM-DD' })
  date: string;

  @ApiProperty({ example: 1350.78, description: 'Valor monetario del indicador para esa fecha' })
  value: number;

  @ApiProperty({
    example: 'Mil trescientos cincuenta pesos con setenta y ocho centavos',
    description: 'Descripción legible del valor para presentación humana',
  })
  details: string;

  constructor(date: Date, value: number, details: string) {
    this.date = date.toISOString().split('T')[0];
    this.value = value;
    this.details = details;
  }
}

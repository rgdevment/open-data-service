import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsDateString, IsInt, IsString } from 'class-validator';
import { DateOnlyTransform } from '../../../utils/date-only.transform';

export class SalaryEntryDto {
  @ApiProperty({ example: 500000, description: 'Monto del salario mínimo en pesos chilenos' })
  @IsInt()
  amount!: number;

  @ApiProperty({
    example: 'Salario mínimo general para mayores de 18 años',
    description: 'Descripción del tipo o categoría del salario',
  })
  @IsString()
  details!: string;

  @ApiProperty({
    example: '2023-09-01 a 2024-04-30',
    description: 'Rango de fechas en que este salario estuvo vigente',
  })
  @IsString()
  range!: string;

  @ApiProperty({
    example: '2023-09-01',
    description: 'Fecha de inicio del salario (formato YYYY-MM-DD)',
  })
  @IsDateString()
  @Transform(DateOnlyTransform)
  date!: string;

  constructor(partial: Partial<SalaryEntryDto>) {
    Object.assign(this, partial);
  }
}

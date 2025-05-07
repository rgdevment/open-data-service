import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, ValidateNested } from 'class-validator';
import { SalaryEntryDto } from './salary-entry.dto';

export class SalaryResponseDto {
  @ApiProperty({
    description: 'Salario mínimo actual vigente',
    type: SalaryEntryDto,
  })
  @ValidateNested()
  @Type(() => SalaryEntryDto)
  current!: SalaryEntryDto;

  @ApiProperty({
    description: 'Historial completo de salarios mínimos historicos',
    type: [SalaryEntryDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => SalaryEntryDto)
  historic!: SalaryEntryDto[];

  constructor(partial: Partial<SalaryResponseDto>) {
    Object.assign(this, partial);
  }
}

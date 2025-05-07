import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionVoluntarySavingDto {
  @ApiPropertyOptional({ example: 0.7, description: 'Comisión por ahorro voluntario para afiliados (%)' })
  affiliated?: number;
}

import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionVoluntaryPensionDto {
  @ApiPropertyOptional({ example: 0.9, description: 'Comisión para afiliados (%)' })
  affiliated?: number;

  @ApiPropertyOptional({ example: 1.1, description: 'Comisión para no afiliados (%)' })
  nonAffiliated?: number;

  @ApiPropertyOptional({ example: 0.6, description: 'Comisión por transferencias (%)' })
  transfer?: number;
}

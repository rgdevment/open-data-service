import { ApiPropertyOptional } from '@nestjs/swagger';

export class CommissionMandatoryDto {
  @ApiPropertyOptional({ example: 1.45, description: 'Comisión por depósito mensual (%)' })
  deposit?: number;

  @ApiPropertyOptional({ example: 0.5, description: 'Comisión por retiro desde la cuenta (%)' })
  withdrawals?: number;

  @ApiPropertyOptional({ example: 0.3, description: 'Comisión por transferencias entre AFPs (%)' })
  transfer?: number;
}

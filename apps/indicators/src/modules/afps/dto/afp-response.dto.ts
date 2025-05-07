import { ApiProperty } from '@nestjs/swagger';
import { CommissionMandatoryDto } from './commission-mandatory.dto';
import { CommissionVoluntaryPensionDto } from './commission-voluntary-pension.dto';
import { CommissionVoluntarySavingDto } from './commission-voluntary-saving.dto';

export class AFPResponseDto {
  @ApiProperty({ example: 'ProVida' })
  name!: string;

  @ApiProperty({ example: 123456 })
  quota!: number;

  @ApiProperty({ type: CommissionMandatoryDto })
  mandatory!: CommissionMandatoryDto;

  @ApiProperty({ type: CommissionVoluntaryPensionDto })
  voluntaryPension!: CommissionVoluntaryPensionDto;

  @ApiProperty({ type: CommissionVoluntarySavingDto })
  voluntarySavings!: CommissionVoluntarySavingDto;
}

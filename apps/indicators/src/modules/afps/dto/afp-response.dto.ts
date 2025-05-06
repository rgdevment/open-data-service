import type { CommissionMandatoryDto } from './commission-mandatory.dto';
import type { CommissionVoluntaryPensionDto } from './commission-voluntary-pension.dto';
import type { CommissionVoluntarySavingDto } from './commission-voluntary-saving.dto';

export class AFPResponseDto {
  name!: string;
  quota!: number;
  mandatory!: CommissionMandatoryDto;
  voluntaryPension!: CommissionVoluntaryPensionDto;
  voluntarySavings!: CommissionVoluntarySavingDto;
}

import { Injectable } from '@nestjs/common';
import { AfpRepository } from './afp.repository';
import { AFPResponseDto } from './dto/afp-response.dto';
import { CommissionMandatoryDto } from './dto/commission-mandatory.dto';
import { CommissionVoluntaryPensionDto } from './dto/commission-voluntary-pension.dto';
import { CommissionVoluntarySavingDto } from './dto/commission-voluntary-saving.dto';
import { AfpEnum } from './enums/afp.enum';

@Injectable()
export class AfpService {
  constructor(private readonly repository: AfpRepository) {}

  async retrieveCurrentAFPData(afp: AfpEnum): Promise<AFPResponseDto> {
    const afpRecords = await this.repository.findLatestAfp(afp);

    if (!afpRecords.length) {
      throw new Error(`No AFP records found for ${afp}`);
    }

    let quota = 0;

    const mandatory: CommissionMandatoryDto = {};
    const voluntaryPension: CommissionVoluntaryPensionDto = {};
    const voluntarySavings: CommissionVoluntarySavingDto = {};

    for (const record of afpRecords) {
      const categoryCode = record.category.code;
      const subcategoryCode = record.subcategory.code;
      const key = `${categoryCode}_${subcategoryCode}`;
      const value = this.toNumber(record.commission);

      switch (key) {
        case 'APO_DEPOSIT':
          mandatory.deposit = value;
          quota = value;
          break;
        case 'APO_WITHDRAWALS':
          mandatory.withdrawals = value;
          break;
        case 'APO_TRANSFER':
          mandatory.transfer = value;
          break;
        case 'APV_AFFILIATES':
          voluntaryPension.affiliated = value;
          break;
        case 'APV_NO_AFFILIATES':
          voluntaryPension.nonAffiliated = value;
          break;
        case 'APV_TRANSFER':
          voluntaryPension.transfer = value;
          break;
        case 'AV_AFFILIATES':
          voluntarySavings.affiliated = value;
          break;
      }
    }

    return {
      name: afpRecords[0].afp.name,
      quota,
      mandatory,
      voluntaryPension,
      voluntarySavings,
    };
  }

  private toNumber(input: number | string | null | undefined): number {
    if (input == null) return 0;
    return typeof input === 'string' ? parseFloat(input.replace(',', '.')) : input;
  }
}

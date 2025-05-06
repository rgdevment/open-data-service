import { Controller, Get, Param } from '@nestjs/common';
import { AfpService } from './afp.service';
import { AFPResponseDto } from './dto/afp-response.dto';
import { AfpEnum } from './enums/afp.enum';
import { AfpParsePipe } from './validators/afp-parse.pipe';

@Controller('v1/afp')
export class AfpController {
  constructor(private readonly service: AfpService) {}

  @Get(':name')
  async getCommissionData(@Param('name', AfpParsePipe) name: AfpEnum): Promise<AFPResponseDto> {
    return await this.service.retrieveCurrentAFPData(name);
  }
}

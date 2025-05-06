import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { AfpService } from './afp.service';
import { AFPResponseDto } from './dto/afp-response.dto';
import { AfpEnum } from './enums/afp.enum';
import { AfpParsePipe } from './validators/afp-parse.pipe';
import { RedisCacheInterceptor } from 'libs/cache/src/cache.interceptor';

@Controller('v1/afp')
@UseInterceptors(RedisCacheInterceptor)
export class AfpController {
  constructor(private readonly service: AfpService) {}

  @Get(':name')
  async getCommissionData(@Param('name', AfpParsePipe) name: AfpEnum): Promise<AFPResponseDto> {
    return await this.service.retrieveCurrentAFPData(name);
  }
}

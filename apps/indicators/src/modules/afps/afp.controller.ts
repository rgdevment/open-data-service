import { RedisCacheInterceptor } from '@libs/cache';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { AfpService } from './afp.service';
import { AFPResponseDto } from './dto/afp-response.dto';
import { AfpEnum } from './enums/afp.enum';
import { AfpParsePipe } from './validators/afp-parse.pipe';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('AFP')
@Controller('v1/afp')
@UseInterceptors(RedisCacheInterceptor)
export class AfpController {
  constructor(private readonly service: AfpService) {}

  @Get(':name')
  @ApiOperation({
    summary: 'Obtener datos actuales de una AFP',
    description: `
Recupera los datos actuales de comisiones y categorías de una AFP específica, incluyendo tipos fijos y mixtos.

**Parámetros válidos**:
- \`name\`: Código de la AFP (por ejemplo: \`modelo\`, \`cuprum\`, \`provida\`, etc.)

**Notas**:
- El resultado está cacheado para optimizar rendimiento.
    `,
  })
  @ApiParam({
    name: 'name',
    enum: AfpEnum,
    required: true,
    description: 'Nombre corto de la AFP (enum)',
    example: 'provida',
  })
  @ApiResponse({
    status: 200,
    description: 'Datos de la AFP recuperados exitosamente',
    type: AFPResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Nombre de AFP inválido o mal formateado',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró información para la AFP solicitada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getCommissionData(@Param('name', AfpParsePipe) name: AfpEnum): Promise<AFPResponseDto> {
    return await this.service.retrieveCurrentAFPData(name);
  }
}

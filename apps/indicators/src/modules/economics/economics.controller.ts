import { RedisCacheInterceptor } from '@libs/cache';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EconomicResponseDto } from './dto/economic-response.dto';
import { EconomicsService } from './economics.service';
import { EconomicsEnum } from './enums/economics.enum';
import { EconomicsParsePipe } from './validators/economics-parse.pipe';

@ApiTags('Económicos')
@Controller('v1')
@UseInterceptors(RedisCacheInterceptor)
export class EconomicsController {
  constructor(private readonly service: EconomicsService) {}

  @Get(':indicator')
  @ApiOperation({
    summary: 'Obtiene el valor actual, promedio mensual y registros de un indicador económico',
    description: `
Devuelve el valor actual del indicador económico solicitado, junto con el promedio del mes y registros históricos.

**Indicadores disponibles**:
- \`UF\`: Unidad de Fomento
- \`UTM\`: Unidad Tributaria Mensual
- \`IPC\`: Índice de Precios al Consumidor
    `,
  })
  @ApiParam({
    name: 'indicator',
    enum: EconomicsEnum,
    required: true,
    example: 'UF',
    description: 'Código del indicador económico (UF, UTM, IPC)',
  })
  @ApiResponse({
    status: 200,
    description: 'Respuesta con los datos del indicador solicitado',
    content: {
      'application/json': {
        examples: {
          UF: {
            summary: 'Unidad de Fomento (UF)',
            value: {
              indicator: 'UF',
              average: 37910.42,
              records: [
                {
                  date: '2025-05-01',
                  value: 37800.12,
                  details: 'treinta y siete mil ochocientos pesos con doce centavos',
                },
              ],
            },
          },
          IPC: {
            summary: 'Índice de Precios al Consumidor (IPC)',
            value: {
              indicator: 'IPC',
              accumulated: 3.2,
              accumulatedYearly: 9.8,
              records: [
                {
                  date: '2025-04-01',
                  value: 0.8,
                  details: 'Variación mensual del IPC',
                },
              ],
            },
          },
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'Parámetro inválido o indicador no reconocido',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron datos para el indicador solicitado',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  getIndicator(@Param('indicator', EconomicsParsePipe) indicator: EconomicsEnum): Promise<EconomicResponseDto> {
    return this.service.getIndicator(indicator);
  }
}

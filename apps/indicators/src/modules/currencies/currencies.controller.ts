import { RedisCacheInterceptor } from '@libs/cache';
import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CurrenciesService } from './currencies.service';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { CurrenciesEnum } from './enums/currencies.enum';
import { CurrenciesParsePipe } from './validators/currencies-parse.pipe';

@ApiTags('Divisas')
@Controller('v1/divisa')
@UseInterceptors(RedisCacheInterceptor)
export class CurrenciesController {
  constructor(private readonly service: CurrenciesService) {}

  @Get(':currency')
  @ApiOperation({
    summary: 'Obtiene el valor actual, promedio y registros históricos de una divisa',
    description: `
Recupera los valores de una divisa en Chile, incluyendo el valor actual,
el promedio mensual y los registros más recientes disponibles.

**Valores válidos**: \`DOLAR\`, \`EURO\`, \`UTM\`, \`BITCOIN\`, etc.
    `,
  })
  @ApiParam({
    name: 'currency',
    required: true,
    enum: CurrenciesEnum,
    example: 'EURO',
    description: 'Código de la divisa (en mayúsculas)',
  })
  @ApiResponse({
    status: 200,
    description: 'Divisa encontrada y procesada exitosamente',
    type: CurrencyResponseDto,
    content: {
      'application/json': {
        example: {
          currency: 'EURO',
          average: 1350.78,
          records: [
            {
              date: '2024-09-01',
              value: 1350.78,
              details: 'Mil trescientos cincuenta pesos con setenta y ocho centavos',
              _note: 'Valor actualizado al día de hoy.',
            },
            {
              date: '2024-09-15',
              value: 1358.42,
              details: 'Mil trescientos cincuenta y ocho pesos con cuarenta y dos centavos',
              _note: 'Valor del primer día del mes.',
            },
          ],
        },
      },
    },
  })
  @ApiResponse({
    status: 400,
    description: 'El código de divisa es inválido o no soportado',
  })
  @ApiResponse({
    status: 404,
    description: 'No hay datos disponibles para la divisa solicitada',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno del servidor',
  })
  async getCurrency(@Param('currency', CurrenciesParsePipe) currency: CurrenciesEnum): Promise<CurrencyResponseDto> {
    return this.service.retrieveDetailsCurrencyIndicator(currency);
  }
}

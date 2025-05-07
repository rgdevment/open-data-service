import { RedisCacheInterceptor } from '@libs/cache';
import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SalaryResponseDto } from './dto/salary.response.dto';
import { SalariesService } from './salaries.service';

@ApiTags('Salariales')
@Controller('v1/salario')
@UseInterceptors(RedisCacheInterceptor)
export class SalariesController {
  constructor(private readonly service: SalariesService) {}

  @Get('base')
  @ApiOperation({
    summary: 'Obtiene el salario mínimo actual y su historial',
    description: `
Devuelve el salario mínimo vigente junto a los cambios históricos registrados.
Ideal para análisis económico o referencias laborales.

**Notas**:
- Los valores están expresados en pesos chilenos.
- El resultado puede ser cacheado para mejorar rendimiento.
    `,
  })
  @ApiResponse({
    status: 200,
    description: 'Salario mínimo recuperado exitosamente',
    type: SalaryResponseDto,
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontraron registros de salario mínimo',
  })
  @ApiResponse({
    status: 500,
    description: 'Error interno al recuperar los datos',
  })
  async getMinimumWage(): Promise<SalaryResponseDto> {
    return this.service.retrieveMinimumWage();
  }
}

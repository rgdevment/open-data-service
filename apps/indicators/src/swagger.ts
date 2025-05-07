import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Indicadores Chile API')
    .setDescription(
      'API Open-Source con indicadores económicos, financieros, ' +
        'previsionales y salariales para Chile. Incluye UF, UTM, IPC, divisas, comisiones AFP y sueldos mínimos.',
    )
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('v1/docs', app, document);
}

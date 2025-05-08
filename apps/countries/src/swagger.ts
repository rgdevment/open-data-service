import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Retrieve Countries API')
    .setContact('Github Repository', 'https://github.com/rgdevment/open-data-service/tree/main/apps/countries', '')
    .setDescription('API to retrieve country, state and city data.')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);
  SwaggerModule.setup('v1/docs', app, document);
}

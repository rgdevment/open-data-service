import type { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication): void {
  const config = new DocumentBuilder()
    .setTitle('Neighborly API')
    .setContact('Github Repository', 'https://github.com/rgdevment/open-data-service/tree/main/apps/neighborly', '')
    .setDescription('API to Community Hub.')
    .setVersion('1.0')
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('/', app, document);
  SwaggerModule.setup('v1/docs', app, document);
}

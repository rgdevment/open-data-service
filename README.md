# Open Data Services

Monorepo oficial que agrupa microservicios públicos y gratuitos orientados a ofrecer acceso abierto a información útil como datos geográficos, indicadores financieros, y más.

## Estructura del proyecto

- apps/
  - countries: API REST que entrega información geográfica (países, estados, ciudades, banderas, población)
  - indicators: API REST que entrega indicadores financieros de Chile (UF, IPC, dólar, UTM, etc.)
- libs/: Librerías compartidas (por ejemplo: configuración, utilidades, auth, métricas, etc.)
- infrastructure/: Configuración de Docker, bases de datos, Prometheus, Grafana, backups, etc.

## Requisitos

- Node.js 22+
- pnpm 8+
- Docker y Docker Compose
- Make

## Instalación

1. Clona el repositorio:
   git clone https://github.com/rgdevment/open-data-services.git

2. Instala las dependencias:
   pnpm install

3. Copia el archivo de entorno:
   cp .env.example .env

4. Levanta el entorno de desarrollo:
   make up-dev

## Comandos útiles

- make up-dev # Levanta entorno de desarrollo
- make down-dev # Detiene entorno
- make logs-dev # Muestra logs de la app seleccionada (por defecto: countries-service)
- make lint # Lint del código
- make format # Formatea el código
- make test # Ejecuta tests
- make reset-db-dev # Resetea contenedores y base de datos
- pnpm run deps:check # 🔍 Ver diferencias entre versiones
- pnpm run deps:fix # 🔧 Corrige automáticamente
- pnpm run deps:dedupe # 🧹 Limpia duplicados innecesarios
- pnpm run deps:format # 🧼 Ordena tus package.json con estilo

Puedes cambiar la app actual usando:

make logs-dev APP=indicators-service

## Documentación

Cada app incluye su documentación Swagger en `/docs` una vez levantada.

Ejemplo:
http://localhost:3000/docs

## Licencia

MIT License. Este proyecto es open source y mantenido por la comunidad.

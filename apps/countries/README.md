# Retrieve Countries (Legacy)

Retrieve Countries es una API REST de código abierto bajo la licencia MIT que te permite consultar datos sobre países, ciudades y otra información relevante en todo el mundo. Esta API está en continuo desarrollo y crecimiento.

## Disponible en otros idiomas:

- [English (Inglés)](README.en.md)

## Documentación

- [Documentación Swagger](https://countries.apirest.cl/v1/docs)

## Ejemplos de uso

Puedes obtener información sobre un país y sus ciudades con esta simple llamada:

    curl -X GET "https://countries.apirest.cl/v1/country/chile"

O, si lo prefieres, puedes obtener todos los países de una región específica:

    curl -X GET "https://countries.apirest.cl/v1/region/americas"

Incluso puedes obtener todos los países del mundo con una sola petición:

    curl -X GET "https://countries.apirest.cl/v1/"

También puedes mostrar u ocultar información adicional con los siguientes **parámetros opcionales**:

- `excludeCities` (opcional): booleano
- `excludeStates` (opcional): booleano

Para más información y otros endpoints, consulta la Documentación en Postman o Swagger.

## Instrucciones para instalación local

Si quieres probar el proyecto localmente o montarlo en tu propio entorno, sigue estos pasos.

### Requisitos

- **Node.js**: 20.x LTS
- **Yarn**: 4.4

### Instalación

1. Clona el repositorio:

   - git clone https://github.com/rgdevment/retrieve-countries
   - cd retrieve-countries

2. Instala las dependencias:

   - yarn install

3. Configura las variables de entorno:

   - cp .env.example .env
   - Edita el archivo `.env` con tus propios valores.

4. Ejecuta el proyecto:
   - yarn start:dev

Este comando levantará la API en un entorno de desarrollo.

## Licencia

Este proyecto está licenciado bajo la Licencia MIT. Consulta el archivo [LICENSE](LICENSE) para más detalles.

# Open Data Services

[![Build CI](https://github.com/rgdevment/open-data-services/actions/workflows/main.yml/badge.svg)](https://github.com/rgdevment/open-data-services/actions/workflows/main.yml)
[![CodeQL](https://github.com/rgdevment/open-data-services/actions/workflows/codeql.yml/badge.svg)](https://github.com/rgdevment/open-data-services/actions/workflows/codeql.yml)
[![SonarCloud Quality Gate](https://sonarcloud.io/api/project_badges/measure?project=rgdevment_open-data-service&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=rgdevment_open-data-service)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Un monorepo de alto rendimiento con APIs de datos públicos para la comunidad de desarrolladores. Este proyecto está gestionado con **Nx** para potenciar la compartición de código, los builds inteligentes y una experiencia de desarrollo consistente en todo el ecosistema.

---
## 🚀 Stack Tecnológico

La arquitectura del proyecto se basa en un conjunto de tecnologías modernas, robustas y escalables.

| Categoría | Tecnología | Propósito |
| :--- | :--- | :--- |
| **Orquestación** | [Nx](https://nx.dev/), [pnpm](https://pnpm.io/) | Gestión del monorepo, caché de builds, análisis de dependencias. |
| **Backend** | [NestJS](https://nestjs.com/), [TypeScript](https://www.typescriptlang.org/) | Framework principal para construir APIs eficientes y escalables. |
| **Base de Datos** | [MariaDB](https://mariadb.org/), [TypeORM](https://typeorm.io/) | Persistencia de datos relacional y Object-Relational Mapper. |
| **Caché** | [Redis](https://redis.io/) | Caché en memoria para optimizar el rendimiento de las respuestas. |
| **DevOps** | [Docker](https://www.docker.com/), [GitHub Actions](https://github.com/features/actions) | Contenerización, CI/CD, builds y despliegues automatizados. |
| **Monitoreo** | [Prometheus](https://prometheus.io/) | Exposición de métricas de la aplicación para observabilidad. |

---
## 🌐 Ecosistema de Servicios

Actualmente, el ecosistema se compone de los siguientes servicios y librerías:

### Aplicaciones ("apps/")
* **countries-service**: Una API REST completa que sirve información geográfica detallada de países.
* **indicators-service**: Una API REST enfocada en entregar indicadores financieros y económicos de Chile.

### Librerías Compartidas ("libs/")
* **@libs/database**: Centraliza la conexión y configuración de la base de datos.
* **@libs/security**: Encapsula toda la lógica de seguridad y autenticación (JWT).
* **@libs/cache**: Provee una capa de caché unificada con Redis.
* **@libs/health & @libs/prometheus**: Exponen endpoints de "health check" y métricas.
* **@libs/common**: Contiene utilidades, enums y DTOs comunes a todo el ecosistema.

---
## 🏁 Primeros Pasos

### Requisitos Previos
- Node.js v22+
- pnpm v10+
- Docker y Docker Compose
- Make

### Instalación
1.  **Clonar el repositorio:**

        git clone [https://github.com/rgdevment/open-data-services.git](https://github.com/rgdevment/open-data-services.git)
        cd open-data-services

2.  **Instalar dependencias:**

        pnpm install

3.  **Crear la red de Docker:**

        make ensure-network

4.  **Configurar variables de entorno:**
    Copia los archivos ".env.example" a ".env" dentro de la carpeta de cada aplicación que quieras ejecutar.

        cp apps/countries/.env.example apps/countries/.env
        cp apps/indicators/.env.example apps/indicators/.env

---
## 🛠️ Flujo de Trabajo en Desarrollo

El "Makefile" está optimizado para simplificar la interacción con el entorno.

### Levantar un Servicio
Para trabajar en la API de "countries" y sus servicios dependientes ("mariadb", "redis"):

        make dev APP=countries

### Comandos de Desarrollo Útiles
- **make dev APP="nombre"**: Inicia el entorno de desarrollo para la app especificada.
- **make dev-down**: Detiene y elimina todos los contenedores de desarrollo.
- **make logs-dev APP="nombre"**: Muestra los logs en tiempo real de una aplicación.
- **make test APP="nombre"**: Ejecuta los tests de una app o librería (aprovechando la caché de Nx).

---
## 🚢 Build y Despliegue a Producción

- **make build APP="nombre"**: Construye la imagen de Docker de producción para una app.
- **make prod**: Levanta todo el stack de producción definido en "docker-compose.yml".
- **make prod-down**: Detiene y elimina todos los contenedores de producción.

---
## 📄 Documentación de APIs

Cada API incluye su documentación interactiva con **Swagger**. Una vez que una aplicación está corriendo, puedes acceder a ella en la ruta "/docs".

**Ejemplo (corriendo "countries" en desarrollo):**
http://localhost:3024/docs

---
## 📜 Licencia

Este proyecto es de código abierto y está distribuido bajo la **Licencia MIT**.

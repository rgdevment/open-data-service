# -------------------------
# Requisitos obligatorios
# -------------------------
ifndef APP
$(error ❌ Debes especificar APP=<nombre> (ej: make build APP=countries))
endif

APP_PATH = apps/$(APP)
STACK_NAME = internal-net
ENV_FILE ?= $(APP_PATH)/.env
CONTAINER ?= $(APP)-service

# -------------------------
# Producción
# -------------------------

build:
	docker build . \
		--file infrastructure/Dockerfile \
		--build-arg APP_PATH=$(APP_PATH) \
		--tag open-data-$(APP)

up-prod:
	docker compose -f $(APP_PATH)/docker-compose.yml up -d --build

down-prod:
	docker compose -f $(APP_PATH)/docker-compose.yml down

restart-prod:
	docker compose -f $(APP_PATH)/docker-compose.yml restart

logs-prod:
	docker compose -f $(APP_PATH)/docker-compose.yml logs -f $(CONTAINER)

# -------------------------
# Desarrollo
# -------------------------

up-dev: ensure-env ensure-network
	docker compose -f $(APP_PATH)/docker-compose.dev.yml up -d --build

down-dev:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml down

restart-dev:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml restart

logs-dev:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml logs -f $(CONTAINER)

ps-dev:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml ps

reset-db-dev:
	$(MAKE) down-dev APP=$(APP)
	$(MAKE) up-dev APP=$(APP)

# -------------------------
# Código
# -------------------------

build-app:
	pnpm --filter $(APP) build

lint:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml exec $(CONTAINER) pnpm lint

format:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml exec $(CONTAINER) pnpm format

test:
	docker compose -f $(APP_PATH)/docker-compose.dev.yml exec $(CONTAINER) pnpm test

# -------------------------
# Utilidades
# -------------------------

ensure-network:
	sh infrastructure/network/internal-net.sh

ensure-env:
	@if [ ! -f $(ENV_FILE) ]; then \
		echo "⚠️  $(ENV_FILE) no encontrado. Copiando desde .env.example..."; \
		cp .env.example $(ENV_FILE); \
	else \
		echo "✅ $(ENV_FILE) ya existe."; \
	fi

# -------------------------
.PHONY: build up-prod down-prod restart-prod logs-prod \
        up-dev down-dev restart-dev logs-dev ps-dev reset-db-dev \
        lint format test ensure-network ensure-env build-app

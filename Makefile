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
# Stack Compartido (solo DEV)
# -------------------------

shared-dev-up:
	docker compose -f docker-compose.dev.yml up -d

shared-dev-down:
	docker compose -f docker-compose.dev.yml down

shared-dev-logs:
	docker compose -f docker-compose.dev.yml logs -f

shared-dev-ps:
	docker compose -f docker-compose.dev.yml ps

shared-dev-restart:
	docker compose -f docker-compose.dev.yml restart

# -------------------------
# Producción
# -------------------------

build:
	docker build . \
		--file infrastructure/Dockerfile \
		--build-arg APP_PATH=$(APP_PATH) \
		--tag open-data-$(APP)

up-prod:
	docker compose -f docker-compose.yml up -d --build

down-prod:
	docker compose -f docker-compose.yml down

restart-prod:
	docker compose -f docker-compose.yml restart

logs-prod:
	docker compose -f docker-compose.yml logs -f $(CONTAINER)

deploy:
	@echo "🔄 Pulling latest changes from origin/main..."
	@git pull origin main

	@echo "♻️  Rebuilding and restarting service for all..."
	docker compose -f docker-compose.yml up -d --build

	@echo "📋 Logs for all:"
	docker compose -f docker-compose.yml logs --tail=50
# -------------------------
# Desarrollo
# -------------------------

up-dev: ensure-network shared-dev-up refresh-lock
	docker compose -f $(APP_PATH)/docker-compose.dev.yml up -d --build

down-dev: shared-dev-down
	docker compose -f $(APP_PATH)/docker-compose.dev.yml down

restart-dev: shared-dev-restart
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

refresh-lock:
	pnpm install --lockfile-only

# -------------------------
.PHONY: build up-prod down-prod restart-prod logs-prod \
        up-dev down-dev restart-dev logs-dev ps-dev reset-db-dev \
        lint format test ensure-network ensure-env build-app
				shared-dev-restart shared-dev-ps shared-dev-logs shared-dev-down shared-dev-up

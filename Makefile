# Default App. Usage: make up-dev APP=neighborly
APP ?= countries
# Service names in docker-compose & Nx project names are defined as <app-name>-service
CONTAINER = $(APP)-service

# Define compose files to avoid repetition and make commands cleaner
COMPOSE_PROD = docker compose -f docker-compose.yml
COMPOSE_DEV  = docker compose -f docker-compose.dev.yml

.DEFAULT_GOAL := help

# =========================
# === 🛠️ Development
# =========================
.PHONY: dev dev-down logs-dev restart-dev ps-dev reset-db

## Starts the specified app's container and shared services (db, redis)
dev: ensure-network
	@echo "🚀 Starting development environment for $(CONTAINER)..."
	$(COMPOSE_DEV) up -d $(CONTAINER) mariadb redis

## Stops and removes all development containers
dev-down:
	@echo "Stopping all development containers..."
	$(COMPOSE_DEV) down --remove-orphans

## Follows the logs of a specific development app container
logs-dev:
	$(COMPOSE_DEV) logs -f $(CONTAINER)

## Restarts a specific development app container
restart-dev:
	$(COMPOSE_DEV) restart $(CONTAINER)

## Lists all running development containers
ps-dev:
	$(COMPOSE_DEV) ps

## Resets the database by restarting all dev services
reset-db:
	$(MAKE) dev-down
	$(MAKE) dev APP=$(APP)

# =========================
# === ✨ Code Quality
# =========================
.PHONY: build-app lint test format

## Builds a specific app locally using Nx cache
build-app:
	npx nx build $(CONTAINER)

## Lints a specific app or library using Nx cache
lint:
	npx nx lint $(CONTAINER)

## Runs tests for a specific app or library using Nx cache
test:
	npx nx test $(CONTAINER)

## Formats the entire codebase with Prettier
format:
	pnpm format

# =========================
# === Production
# =========================
.PHONY: build prod prod-down logs-prod restart-prod logs-all deploy

## Builds a production-ready docker image for a specific app
build:
	docker build . \
	 --file infrastructure/Dockerfile \
	 --build-arg APP=$(CONTAINER) \
	 --build-arg APP_DIR=$(APP) \
	 --tag open-data-$(APP)

## Starts the entire production stack (all apps & services)
prod:
	@echo "🚀 Starting production environment..."
	$(COMPOSE_PROD) up -d --build

## Stops and removes all production containers
prod-down:
	@echo "Stopping all production containers..."
	$(COMPOSE_PROD) down --remove-orphans

## Follows the logs of a specific production app container
logs-prod:
	$(COMPOSE_PROD) logs -f $(CONTAINER)

## Follows the logs of all production containers
logs-all:
	$(COMPOSE_PROD) logs -f

## Restarts a specific production app container
restart-prod:
	$(COMPOSE_PROD) restart $(CONTAINER)

## Pulls latest changes and redeploys the entire production stack
deploy:
	@echo "🔄 Pulling latest changes from origin/main..."
	@git pull origin main
	@echo "♻️  Rebuilding and restarting all services..."
	$(MAKE) prod

# =========================
# === 🧹 Utilities
# =========================
.PHONY: ensure-network prune help

## Ensures the shared docker network exists
ensure-network:
	@sh infrastructure/network/internal-net.sh

## Forcefully removes all unused Docker data (containers, images, cache)
prune:
	docker system prune -a --volumes

## Displays this help message
help:
	@echo "Available commands:"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# -----------------------
# STAGE 1: Build app
# -----------------------
FROM node:22-alpine AS builder

ARG APP_PATH
WORKDIR /repo

RUN npm install -g pnpm

COPY tsconfig.base.json ./

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY ${APP_PATH} ${APP_PATH}
COPY libs libs
COPY types types

RUN pnpm install --frozen-lockfile

WORKDIR /repo/${APP_PATH}
RUN pnpm prepare:patch
RUN pnpm build

RUN echo "📁 Contenido de dist generado:" && ls -l /repo/${APP_PATH}/dist

# -----------------------
# STAGE 2: Runtime
# -----------------------
FROM node:22-alpine AS runner

ARG APP_PATH
ENV APP_PATH=${APP_PATH}

WORKDIR /app

COPY --from=builder /repo/${APP_PATH}/dist ./dist
COPY --from=builder /repo/${APP_PATH}/package.json ./
COPY --from=builder /repo/node_modules ./node_modules
COPY infrastructure/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENV NODE_ENV=production
EXPOSE 3000

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

CMD ["/entrypoint.sh"]

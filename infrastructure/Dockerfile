# -----------------------
# STAGE 1: Builder
# -----------------------
FROM node:22-alpine AS builder

WORKDIR /repo
RUN npm install -g pnpm

COPY . .

RUN pnpm install --frozen-lockfile

ARG APP
RUN npx nx build ${APP}

RUN pnpm --filter=${APP} deploy --legacy /deploy

# -----------------------
# STAGE 2: Final Runner
# -----------------------
FROM node:22-alpine AS runner

ENV NODE_ENV=production

WORKDIR /app

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

COPY --from=builder /deploy .

COPY infrastructure/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

USER appuser
EXPOSE 3000

CMD ["/entrypoint.sh"]

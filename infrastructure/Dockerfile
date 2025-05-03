# -----------------------
# STAGE 1: Build app
# -----------------------
FROM node:22-alpine AS builder

ARG APP_PATH

WORKDIR /repo

# Global install
RUN npm install -g pnpm

# Copy workspace metadata
COPY package.json pnpm-lock.yaml ./

# Copy all app and lib manifests
COPY ${APP_PATH}/package.json ${APP_PATH}/
COPY libs/*/package.json libs/*/

# Install all deps across workspace
RUN pnpm install --frozen-lockfile

# Copy source code of all apps and libs
COPY ${APP_PATH} ${APP_PATH}
COPY libs libs

# Build the selected app
WORKDIR /repo/${APP_PATH}
RUN pnpm build

# -----------------------
# STAGE 2: Runtime
# -----------------------
FROM node:22-alpine AS runner

ARG APP_PATH

RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

WORKDIR /app

RUN npm install -g pnpm

COPY --from=builder /repo/${APP_PATH}/dist ./dist
COPY --from=builder /repo/${APP_PATH}/package.json ./
COPY --from=builder /repo/node_modules ./node_modules

ENV NODE_ENV=production
EXPOSE 3000

CMD ["node", "dist/main"]

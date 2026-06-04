FROM node:22-slim AS build-base

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

WORKDIR /ember

COPY package.json ./

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY ui-core/package.json ./ui-core/
COPY frontend/package.json ./frontend/

RUN pnpm install --frozen-lockfile

COPY . .

FROM build-base AS build-frontend

RUN pnpm --filter timed build --environment=production

FROM nginx:alpine AS dist

RUN apk update --no-cache && \
    apk upgrade --no-cache && \
    apk add shadow --no-cache && \
    rm -rf /var/cache/apk/*

EXPOSE 80

COPY 99-configure-oidc.sh /docker-entrypoint.d/
COPY nginx.conf /etc/nginx/conf.d/default.conf

# FROM dist AS customer-center
# COPY --from=build-frontend /ember/customer-center/dist /usr/share/nginx/html

FROM dist AS frontend
COPY --from=build-frontend /ember/frontend/dist /usr/share/nginx/html

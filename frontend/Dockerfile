FROM node:25-slim AS build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN apt-get -y update && apt-get -y install git && \
  corepack enable && \
  corepack prepare pnpm@9.15.4 --activate

WORKDIR /ember

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build --environment=production

FROM nginx:alpine

RUN apk update --no-cache && \
  apk upgrade --no-cache && \
  apk add shadow --no-cache && \
  rm -rf /var/cache/apk/*

EXPOSE 80

COPY 99-configure-oidc.sh /docker-entrypoint.d/

COPY --from=build /ember/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
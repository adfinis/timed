FROM node:18-slim as build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

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
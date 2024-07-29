FROM node:22-slim as build

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable

WORKDIR /ember

COPY package.json pnpm-lock.yaml ./

RUN pnpm install --frozen-lockfile

COPY . .

RUN pnpm build --environment=production

FROM nginx:alpine

EXPOSE 80

COPY 99-configure-oidc.sh /docker-entrypoint.d/

COPY --from=build /ember/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
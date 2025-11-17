FROM node:20-slim AS build

RUN corepack enable && corepack prepare yarn@v1

WORKDIR /ember

COPY package.json yarn.lock ./

RUN yarn install --frozen-lockfile

COPY . .

RUN yarn build --environment=production

FROM nginx:alpine

RUN apk update --no-cache && \
  apk upgrade --no-cache && \
  apk add shadow --no-cache && \
  rm -rf /var/cache/apk/*

EXPOSE 80

COPY 99-configure.sh /docker-entrypoint.d/

COPY --from=build /ember/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

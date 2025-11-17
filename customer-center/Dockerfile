FROM node:18-alpine AS builder

ARG AUTH_ROLE_ADMIN
ARG AUTH_ROLE_EMPLOYEE
ARG AUTH_ROLE_CUSTOMER
ARG TIMED_STAGING_HOST
ARG TIMED_PROD_HOST
# Install dependencies.
RUN apk update && \
  apk add --no-cache \
  --virtual build-dependencies \
  build-base \
  gcc \
  wget \
  git

# Create unprivileged account.
RUN adduser -D project

# Switch working directory.
WORKDIR /tmp/project

# Copy source code.
COPY . ./

# Install dependencies and build application.
RUN yarn install && yarn build

FROM nginx:1.18-alpine AS server

# Copy the built application to the new image.
COPY --from=builder /tmp/project/dist /usr/share/nginx/html
# Copy the NGINX configuration with proper location handling.
COPY nginx.conf /etc/nginx/conf.d/default.conf


WORKDIR /usr/share/nginx/html

COPY ./docker-entrypoint.sh /
ENV OIDC_CLIENT_HOST https://sso.example.com/auth/realms/example/protocol/openid-connect
ENV OIDC_CLIENT cc

EXPOSE 80

ENTRYPOINT ["/docker-entrypoint.sh"]
CMD ["nginx", "-g", "daemon off;"]

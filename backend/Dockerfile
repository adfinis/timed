FROM ghcr.io/astral-sh/uv:python3.12-alpine AS builder

ENV UV_NO_DEV=1
ENV UV_PYTHON_DOWNLOADS=0

WORKDIR /app
COPY . .

RUN uv export --no-emit-workspace --no-hashes -o /tmp/constraints.txt && \
    uv build --wheel && mv ./dist/*.whl /tmp/

FROM python:3.12-alpine

RUN apk update --no-cache && apk upgrade --no-cache && apk add shadow --no-cache && useradd -m -r -u 1001 timed && apk del shadow && rm -rf /var/cache/apk/*

RUN mkdir -p /var/www/static && chown timed:timed /var/www/static

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PIP_DEFAULT_TIMEOUT=100 \
    PIP_NO_CACHE_DIR=off

COPY --from=builder /tmp/*.whl /tmp/constraints.txt /tmp/

COPY cmd.sh manage.py /usr/local/bin/

RUN apk add gcc python3-dev musl-dev linux-headers --no-cache && \
    pip install -c /tmp/constraints.txt /tmp/*.whl && rm /tmp/constraints.txt /tmp/*.whl && \
    apk del gcc python3-dev musl-dev linux-headers --no-cache


USER 1001

ENV DJANGO_SETTINGS_MODULE=timed.settings \
    PYTHONUNBUFFERED=1 \
    STATIC_ROOT=/var/www/static \
    HURRICANE_REQ_QUEUE_LEN=200 \
    PYTHONDONTWRITEBYTECODE=

CMD ["cmd.sh"]
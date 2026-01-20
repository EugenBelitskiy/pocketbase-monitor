FROM alpine:latest

# Устанавливаем необходимые пакеты
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    curl

# Скачиваем PocketBase 0.35.0
ARG PB_VERSION=0.35.0
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip \
    && chmod +x /pocketbase

# Создаём директории для данных и хуков
RUN mkdir -p /pb_data /pb_hooks

# Копируем существующую базу данных
COPY pb_data/data.db /pb_data/data.db

# Копируем хуки (если существуют)
COPY pb_hooks/* /pb_hooks/ 2>/dev/null || true

# Expose порт
EXPOSE 8080

# Запускаем PocketBase
CMD ["/pocketbase", "serve", "--http=0.0.0.0:8080"]




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

# Создаём директорию для данных
RUN mkdir -p /pb_data

# Копируем существующую базу данных
COPY pb_data/data.db /pb_data/data.db

# Expose порт
EXPOSE 8080

# Запускаем PocketBase
CMD ["/pocketbase", "serve", "--http=0.0.0.0:8080"]



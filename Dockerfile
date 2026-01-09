FROM alpine:latest

# Устанавливаем необходимые пакеты
RUN apk add --no-cache \
    ca-certificates \
    unzip \
    wget \
    curl

# Скачиваем PocketBase (версия 0.23+ для PostgreSQL)
ARG PB_VERSION=0.23.4
RUN wget https://github.com/pocketbase/pocketbase/releases/download/v${PB_VERSION}/pocketbase_${PB_VERSION}_linux_amd64.zip \
    && unzip pocketbase_${PB_VERSION}_linux_amd64.zip \
    && rm pocketbase_${PB_VERSION}_linux_amd64.zip \
    && chmod +x /pocketbase

# Создаём директорию для данных
RUN mkdir -p /pb_data

# Expose порт
EXPOSE 8080

# Запускаем PocketBase с PostgreSQL
CMD ["/pocketbase", "serve", "--http=0.0.0.0:8080"]

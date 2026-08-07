FROM composer:2 AS composer_deps

WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-interaction --prefer-dist --optimize-autoloader --no-scripts

FROM node:22-alpine AS frontend_build

WORKDIR /app
RUN apk add --no-cache php84 php84-phar php84-openssl php84-mbstring php84-tokenizer php84-ctype php84-session php84-fileinfo php84-dom php84-xml php84-xmlwriter php84-simplexml php84-pdo php84-pdo_sqlite php84-pdo_mysql php84-pdo_pgsql php84-curl php84-intl \
    && ln -sf /usr/bin/php84 /usr/bin/php \
    && printf 'memory_limit=512M\n' > /etc/php84/conf.d/99-build-memory.ini
ENV DB_CONNECTION=sqlite
ENV DB_DATABASE=:memory:
ENV DB_URL=
COPY . .
COPY --from=composer_deps /app/vendor ./vendor
RUN npm ci
RUN npm run build

FROM php:8.4-fpm-alpine AS runtime

WORKDIR /var/www/html

RUN apk add --no-cache nginx supervisor libzip-dev icu-dev oniguruma-dev postgresql-dev \
    && docker-php-ext-install pdo_pgsql pdo_mysql bcmath intl opcache \
    && rm -rf /var/cache/apk/*

COPY --from=composer_deps /app/vendor ./vendor
COPY . .
COPY --from=frontend_build /app/public/build ./public/build

COPY docker/nginx.conf /etc/nginx/http.d/default.conf.template
COPY docker/supervisord.conf /etc/supervisor/conf.d/supervisord.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
# Больше воркеров PHP-FPM (дефолт образа — всего 5), иначе медленные
# defer-запросы /dialogi к удалённой БД занимают пул и дают 502.
COPY docker/php-fpm-pool.conf /usr/local/etc/php-fpm.d/zz-pool.conf

RUN chmod +x /usr/local/bin/entrypoint.sh \
    && mkdir -p /run/nginx /var/log/supervisor \
    && chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Порт контейнера = переменная окружения PORT (Coolify часто ставит 3000). По умолчанию 8080.
ENV PORT=8080
EXPOSE 8080

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisor/conf.d/supervisord.conf"]

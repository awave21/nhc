#!/bin/sh
set -e

cd /var/www/html

# Coolify и другие PaaS часто задают PORT (например 3000). Nginx должен слушать тот же порт, что пробрасывает прокси.
PORT="${PORT:-8080}"
case "$PORT" in
    '' | *[!0-9]*) PORT=8080 ;;
esac
NGINX_TEMPLATE="/etc/nginx/http.d/default.conf.template"
NGINX_CONF="/etc/nginx/http.d/default.conf"
if [ -f "$NGINX_TEMPLATE" ]; then
    sed "s/__LISTEN_PORT__/${PORT}/g" "$NGINX_TEMPLATE" >"$NGINX_CONF"
fi

mkdir -p storage/framework/{cache,sessions,testing,views} storage/logs bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwx storage bootstrap/cache

if [ -n "${APP_KEY}" ]; then
    php artisan config:cache --no-interaction || true
    php artisan route:cache --no-interaction || true
    php artisan view:cache --no-interaction || true
fi

# Если в БД уже есть таблицы (предыдущий деплой / ручной импорт), помечаем
# соответствующие миграции как применённые, чтобы migrate не пытался их перенакатывать.
php artisan migrate:reconcile --no-interaction || true

# Запускаем миграции при каждом старте контейнера (идемпотентны).
php artisan migrate --force --no-interaction || true

exec "$@"

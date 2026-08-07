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

QUEUE_WORKER_CONF=/etc/supervisor/conf.d/queue-worker.conf
rm -f "$QUEUE_WORKER_CONF"
if [ "${QUEUE_CONNECTION:-database}" != "sync" ]; then
    cat > "$QUEUE_WORKER_CONF" <<'EOF'
[program:queue-worker]
command=php /var/www/html/artisan queue:work --tries=3 --max-time=3600 --sleep=3
autostart=true
autorestart=true
user=www-data
priority=15
stdout_logfile=/dev/stdout
stdout_logfile_maxbytes=0
stderr_logfile=/dev/stderr
stderr_logfile_maxbytes=0
EOF
fi

# Явные пути (без bash brace-expansion — entrypoint на /bin/sh / BusyBox).
# Обязательно storage/framework/cache/data — туда пишет файловый кеш; без неё
# любые кеш-операции (включая троттлер логина Fortify) падают с 500.
mkdir -p \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/testing \
    storage/framework/views \
    storage/logs \
    storage/app/public \
    bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
chmod -R ug+rwX storage bootstrap/cache

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

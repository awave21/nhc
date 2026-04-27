#!/usr/bin/env bash
set -euo pipefail

# Выпуск Let's Encrypt для admin.sarasvatiplace.online (или DOMAIN=…).
#
# Требования: публичная DNS A/AAAA домена → IP этого сервера; порт 80 доступен из интернета.
# Проверка: dig +short "$DOMAIN" A @8.8.8.8
#
# Режимы:
#   CERTBOT_MODE=webroot (по умолчанию) — nginx отдаёт /.well-known из public (см. deploy/nginx-*.example).
#   CERTBOT_MODE=standalone — временный веб-сервер certbot на :80 (nginx/apache на :80 должны быть остановлены).
#
# Использование:
#   export CERTBOT_EMAIL='you@example.com'
#   sudo -E ./deploy/certbot-issue.sh
#
# Песочница (без лимитов LE):
#   CERTBOT_STAGING=1 sudo -E ./deploy/certbot-issue.sh
#
# Без email (нежелательно, только если нет почты):
#   CERTBOT_REGISTER_UNSAFE=1 sudo -E ./deploy/certbot-issue.sh

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DOMAIN="${DOMAIN:-admin.sarasvatiplace.online}"
WEBROOT="${WEBROOT:-${ROOT_DIR}/public}"
MODE="${CERTBOT_MODE:-webroot}"

if ! command -v certbot >/dev/null 2>&1; then
    echo 'certbot не найден. Установите: apt install certbot' >&2
    exit 1
fi

if [[ "${CERTBOT_REGISTER_UNSAFE:-0}" == '1' ]]; then
    EMAIL_ARGS=(--register-unsafely-without-email)
else
    EMAIL="${CERTBOT_EMAIL:?Укажите CERTBOT_EMAIL или CERTBOT_REGISTER_UNSAFE=1}"
    EMAIL_ARGS=(--email "${EMAIL}")
fi

ARGS=(certonly -d "${DOMAIN}" "${EMAIL_ARGS[@]}" --agree-tos --non-interactive --keep-until-expiring)

if [[ "${CERTBOT_STAGING:-0}" == '1' ]]; then
    ARGS+=(--staging)
fi

case "${MODE}" in
    webroot)
        install -d -m0755 "${WEBROOT}/.well-known/acme-challenge"
        ARGS+=(--webroot -w "${WEBROOT}")
        ;;
    standalone)
        ARGS+=(--standalone --preferred-challenges http)
        ;;
    *)
        echo "Неизвестный CERTBOT_MODE=${MODE} (ожидается webroot или standalone)" >&2
        exit 1
        ;;
esac

exec certbot "${ARGS[@]}"

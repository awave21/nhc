#!/usr/bin/env bash
set -euo pipefail
# Устанавливает nginx + php8.4-fpm (apt) и включает сайт по IP для /var/www/nhc-admin.
# Запуск: sudo ./deploy/install-nginx-ip.sh

if [[ "${EUID:-0}" -ne 0 ]]; then
    echo 'Запустите с sudo.' >&2
    exit 1
fi

export DEBIAN_FRONTEND=noninteractive
apt-get update -qq
apt-get install -y nginx php8.4-fpm

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
CONF_SRC="${ROOT_DIR}/deploy/nginx-ip-http.conf.example"
CONF_DST=/etc/nginx/sites-available/nhc-admin.conf

if [[ ! -f "${CONF_SRC}" ]]; then
    echo "Не найден ${CONF_SRC}" >&2
    exit 1
fi

cp "${CONF_SRC}" "${CONF_DST}"
rm -f /etc/nginx/sites-enabled/default
ln -sf "${CONF_DST}" /etc/nginx/sites-enabled/nhc-admin.conf

chown -R www-data:www-data "${ROOT_DIR}/storage" "${ROOT_DIR}/bootstrap/cache"
chmod -R ug+rwx "${ROOT_DIR}/storage" "${ROOT_DIR}/bootstrap/cache"

nginx -t
systemctl enable --now nginx php8.4-fpm
systemctl reload nginx

echo 'Готово. Проверка: curl -sS -o /dev/null -w "%{http_code}\n" http://127.0.0.1/up'

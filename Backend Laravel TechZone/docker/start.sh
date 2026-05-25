#!/bin/sh
set -e

PORT="${PORT:-8000}"

php artisan optimize:clear
php artisan storage:link || true
php artisan migrate --force

if [ "${RUN_SEEDERS:-false}" = "true" ]; then
    php artisan db:seed --force
fi

exec php artisan serve --host=0.0.0.0 --port="$PORT"

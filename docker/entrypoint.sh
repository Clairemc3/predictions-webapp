#!/bin/bash

set -e

echo "Waiting for database..."
until php artisan db:monitor > /dev/null 2>&1; do
    echo "Database is unavailable - sleeping"
    sleep 2
done

echo "Database is ready!"

# Build frontend assets
echo "Building frontend assets..."
npm run build

# Run migrations
echo "Running migrations..."
php artisan migrate --force

# Run seeders (only if SEED_DATABASE env is true)
if [ "$SEED_DATABASE" = "true" ]; then
    echo "Running seeders..."
    php artisan db:seed --force
fi

echo "Starting PHP-FPM..."
exec "$@"

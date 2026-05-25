# TechZone

TechZone is a full-stack electro store project with a React/Vite frontend and a Laravel API backend.

## Project Structure

```text
TechZone/
├── Backend Laravel TechZone/      # Laravel API
├── TechZone-Electro-Store-main/   # React/Vite storefront and admin panel
└── load-test.js                   # k6 load testing script
```

## Frontend

```bash
cd TechZone-Electro-Store-main
npm install
npm run dev
```

Production API URL:

```env
VITE_API_URL=https://your-backend-domain.com/api
```

## Backend

```bash
cd "Backend Laravel TechZone"
composer install
cp .env.example .env
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

For production hosting, use a managed PostgreSQL database and configure:

```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://your-backend-domain.com
FRONTEND_URLS=https://your-frontend-domain.com

DB_CONNECTION=pgsql
DB_HOST=your-db-host
DB_PORT=5432
DB_DATABASE=your-db-name
DB_USERNAME=your-db-user
DB_PASSWORD=your-db-password
```

## Load Testing

Run the k6 test against a deployed URL:

```bash
k6 run -e TARGET_URL=https://your-site.com load-test.js
```

The script generates:

- Console JSON summary
- `summary.json`
- `summary.html`

## Recommended Free Hosting

- Frontend: Cloudflare Pages or Vercel
- Backend: Koyeb free web service
- Database: Neon free PostgreSQL

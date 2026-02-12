# Predictions WebApp

A Laravel-powered web application for hosting and participating in predictions for results and actions across a football season.

## About

This is a web app which allows users to participate in football based prediction contests. Users can answer questions about various footballing entities (teams, players, managers, events etc), be awarded points, track their performance, and compete with others throughout a season.

## Tech Stack

### Backend
- **Laravel 12** - PHP framework
- **PHP 8.4**
- **Inertia.js** - Server-side routing with client-side rendering

### Frontend
- **React 19** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS 4** - Utility-first CSS framework
- **Vite** - Build tool and dev server

### Testing
- **Pest 4** - PHP testing framework with browser testing support
- **PHPUnit** - Unit testing


## Getting Started

Run the projecct with Laravel Herd:

### Prerequisites
- PHP 8.4+
- Composer
- Node.js & npm
- Use MySQL 8.4


### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url> predictions-webapp
   cd predictions-webapp
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install node modules:
   ```bash
   npm install
   ```

4. Set up your environment file:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. Configure your database connection in `.env`

6. Run migrations and seeders:
   ```bash
   php artisan migrate --seed
   ```

7. Start the development server:
   ```bash
   php artisan serve
   ```

8. In a separate terminal, start the frontend dev server:
   ```bash
   npm run dev
   ```

### Docker Installation

Alternatively, you can run the application using Docker:

**Prerequisites:** Install [Docker Desktop](https://www.docker.com/products/docker-desktop/) for Mac, Windows, or Linux.

1. Clone the repository:
   ```bash
   git clone <repository-url> predictions-webapp
   cd predictions-webapp
   ```

2. Copy the Docker environment file:
   ```bash
   cp .env.docker .env
   ```

3. Build and start the containers:
   ```bash
   docker compose up -d --build
   ```

4. Generate application key:
   ```bash
   docker compose exec app php artisan key:generate
   ```

The application will be available at `http://localhost:8000` with pres-seeded data

**Note:** The containers automatically run migrations on startup. Seeders run if `SEED_DATABASE=true` in your `.env` file.

**Docker Services:**
- **App**: Laravel application (PHP 8.4-FPM)
- **Nginx**: Web server (port 8000)
- **MySQL**: Database (port 3306)
- **Redis**: Cache and queue (port 6379)
- **Node**: Frontend dev server with Vite (port 5173)

**Useful Docker Commands:**
```bash
# View logs
docker compose logs -f

# Run Artisan commands
docker compose exec app php artisan <command>

# Run tests
docker compose exec app php artisan test

# Access MySQL
docker compose exec mysql mysql -u predictions -psecret predictions

# Stop containers
docker compose down

# Stop and remove volumes
docker compose down -v
```

### Frontend Development with Docker

The node container is already running Vite dev server with hot module replacement. Frontend changes will automatically reflect in the browser. If you need to restart the dev server:

```bash
docker compose restart node
```

### Testing

Run the test suite:
```bash
php artisan test
```

Run specific tests:
```bash
php artisan test --filter=testName
```

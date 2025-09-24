# GitHub Copilot Instructions for Predictions WebApp

## Project Summary

This is a **predictions tracking web application** built with modern full-stack technologies. The application allows users to register, login, and manage predictions with user authentication and email verification. It features a clean, responsive design using Material-UI components.

**Primary Purpose**: Track and manage user predictions with secure authentication
**Target Users**: Authenticated users who need prediction tracking functionality

## Technology Stack & Architecture

### Backend
- **Laravel 11** (PHP 8.4+ required)
- **Database**: SQLite (default, configured for simplicity)
- **Authentication**: Laravel Breeze with Inertia.js integration
- **Email Verification**: Built-in Laravel email verification
- **Testing**: Pest (PHP testing framework)

### Frontend
- **React 18** with TypeScript
- **Build Tool**: Vite 7
- **UI Library**: Material-UI (MUI) v5 with custom theme
- **Routing**: Inertia.js (seamless SPA experience with Laravel)
- **Styling**: MUI Theme System + Tailwind utilities
- **State Management**: Inertia.js useForm + React hooks

### Development Tools
- **Linting**: ESLint with TypeScript support
- **Formatting**: Prettier with import organization
- **Type Checking**: TypeScript strict mode

## Environment Setup & Build Instructions

### Prerequisites
- **PHP 8.4+** (project requires ^8.4)
- **Node.js** (latest LTS recommended)
- **Composer** (PHP dependency management)

### Environment Setup (CRITICAL - Always Required)
1. **ALWAYS copy environment file first:**
   ```bash
   cp .env.example .env
   ```

2. **Set required environment variable in `.env`:**
   ```
   REGISTRATION_CODE=your_secret_registration_code_here
   ```
   - This controls user registration access
   - Required for registration functionality

### Dependency Installation
1. **Install Node.js dependencies (fast, ~30s):**
   ```bash
   npm install
   ```

2. **Install PHP dependencies (slower, may require GitHub token):**
   ```bash
   composer install
   ```
   - If GitHub rate limits occur, use `--no-interaction` flag
   - May require GitHub OAuth token for private repos

### Development Workflow Commands

#### Frontend Commands (All Working)
```bash
# Development server with hot reload (Note: blocked in CI environments)
npm run dev
# In CI: Set LARAVEL_BYPASS_ENV_CHECK=1 to allow dev server

# Production build (working, ~13s)
npm run build

# Build with SSR support
npm run build:ssr

# Type checking (working, fast)
npm run types

# Linting with auto-fix (working, reports current issues)
npm run lint

# Format code (working)
npm run format

# Check formatting without changes
npm run format:check
```

#### Backend Commands
```bash
# Laravel development server (after composer install)
php artisan serve

# Clear Laravel caches (recommended before testing routes)
php artisan config:clear
php artisan route:clear

# Run PHP tests (using Pest)
php artisan test
# OR
composer test

# Integrated development (all services)
composer run dev  # Runs server, queue, logs, and vite concurrently
```

### Current Build State & Known Issues

#### Linting Issues (23 errors currently)
- TypeScript `@typescript-eslint/no-explicit-any` errors in auth pages and components
- Unused variables in theme file and components
- `__dirname` undefined error in `vite.config.js`

#### Formatting Issues
- 24 files need Prettier formatting
- Run `npm run format` to fix automatically

#### Working Commands Validated
- ✅ `npm install` - Fast, completes successfully
- ✅ `npm run build` - Works, builds in ~13s
- ✅ `npm run types` - TypeScript compilation succeeds
- ✅ `npm run dev` - Vite dev server starts correctly
- ⚠️ `npm run lint` - Runs but reports 23 errors
- ⚠️ `composer install` - May timeout due to GitHub API limits

## Project Structure & Architecture

### Directory Layout
```
/
├── .github/
│   └── copilot-instructions.md      # This file
├── app/                             # Laravel application code
│   ├── Http/Controllers/            # Controllers (AuthController, etc.)
│   ├── Models/                      # Eloquent models (User.php)
│   └── [other Laravel directories]
├── bootstrap/                       # Laravel bootstrap
├── config/                          # Laravel configuration files
├── database/                        # Migrations, factories, seeders
├── public/                          # Public assets, compiled builds
├── resources/                       # Frontend source code
│   ├── css/app.css                  # Main stylesheet
│   ├── js/                          # React/TypeScript source
│   │   ├── components/              # Reusable React components
│   │   ├── layouts/                 # Layout components
│   │   │   ├── AuthLayout.tsx       # Authenticated user layout
│   │   │   └── GuestLayout.tsx      # Guest/auth pages layout
│   │   ├── pages/                   # Page components (lowercase files)
│   │   │   ├── auth/                # Authentication pages
│   │   │   │   ├── login.tsx        # Login page
│   │   │   │   ├── register.tsx     # Registration page
│   │   │   │   └── verify-email.tsx # Email verification
│   │   │   ├── profile.tsx          # User profile page
│   │   │   └── users/               # User management
│   │   ├── theme/muiTheme.ts        # MUI theme configuration
│   │   ├── types/                   # TypeScript type definitions
│   │   └── lib/                     # Utility functions
│   └── views/                       # Laravel Blade templates (minimal)
├── routes/                          # Route definitions
│   ├── web.php                      # Web routes (main routes)
│   ├── auth.php                     # Authentication routes
│   └── console.php                  # Artisan commands
├── tests/                           # Test files
│   ├── Feature/Auth/                # Authentication tests
│   └── Pest.php                     # Pest configuration
├── storage/                         # Laravel storage
├── vendor/                          # PHP dependencies (ignored)
└── node_modules/                    # Node.js dependencies (ignored)
```

### Key Configuration Files
- `composer.json` - PHP dependencies and scripts
- `package.json` - Node.js dependencies and scripts
- `vite.config.js` - Vite build configuration
- `eslint.config.js` - ESLint rules and configuration
- `.prettierrc` - Prettier code formatting rules
- `tsconfig.json` - TypeScript configuration
- `phpunit.xml` - PHP testing configuration

### Authentication & Routes
- **Guest Routes**: `/login`, `/register` (redirects authenticated users)
- **Protected Routes**: `/profile`, `/users` (requires auth + email verification)
- **Root Route**: `/` (redirects to profile if authenticated, login if not)
- **Middleware**: `auth` + `verified` for protected routes

### Database Configuration
- **Default**: SQLite (simple, file-based)
- **File Location**: `database/database.sqlite` (auto-created)
- **Migrations**: Standard Laravel migrations in `database/migrations/`
- **Testing**: In-memory SQLite (`:memory:`)

## Coding Standards & Patterns

### File Naming Conventions
- **React Pages**: lowercase with kebab-case (`login.tsx`, `user-profile.tsx`)
- **React Components**: PascalCase (`AuthLayout.tsx`, `ConfirmationDialog.tsx`)
- **Directories**: lowercase (`auth/`, `components/`, `layouts/`)
- **Laravel Files**: Follow Laravel conventions (PascalCase controllers, models)

### Frontend Patterns
- **Components**: Functional components with TypeScript
- **State**: Inertia.js `useForm` for forms, React hooks for local state
- **Styling**: MUI components with custom theme, minimal Tailwind utilities
- **Forms**: MUI TextField with filled variant, proper validation
- **Navigation**: Custom `TextLink` component wrapping Inertia.js Link

### Backend Patterns
- **Controllers**: RESTful patterns, proper validation
- **Models**: Standard Eloquent models
- **Authentication**: Laravel Breeze patterns with Inertia

### Theme Configuration
- **Primary**: Purple theme (`#420B50`)
- **Secondary**: Yellow accent (`#FFD54F`)
- **Typography**: Archivo Black (headings), Carme (body)
- **Components**: Filled inputs, contained buttons, rounded cards

## Validation & Testing

### Continuous Integration
- **No CI/CD currently configured** - only basic linting/build validation
- Test locally before committing changes

### Testing Commands
```bash
# Run all PHP tests (comprehensive auth testing)
php artisan test

# Run specific test file
php artisan test --filter=LoginTest

# Clear caches before testing routes
php artisan config:clear && php artisan route:clear

# Run frontend type checking
npm run types

# Validate frontend build
npm run build
```

### Pre-commit Validation Steps
1. **Format code**: `npm run format`
2. **Check types**: `npm run types`
3. **Build frontend**: `npm run build`
4. **Run tests**: `php artisan test` (requires composer install)
5. **Lint code**: `npm run lint` (may show warnings)

### Common Build Issues & Solutions
1. **Composer install timeouts**: Use `--no-interaction` flag
2. **PHP version mismatch**: Project requires PHP 8.4+, may need adjustment
3. **Missing .env file**: Always copy `.env.example` to `.env`
4. **Missing REGISTRATION_CODE**: Set in `.env` for registration to work
5. **Dev server in CI**: Set `LARAVEL_BYPASS_ENV_CHECK=1` to allow `npm run dev` in CI environments

## Development Workflow Recommendations

### Before Making Changes
1. Ensure environment is set up (`.env` file, dependencies installed)
2. Run `npm run build` to verify current state
3. Clear Laravel caches: `php artisan config:clear && php artisan route:clear`
4. Check existing patterns in similar components before implementing

### Making Changes
1. **Frontend**: Use existing MUI components and theme patterns
2. **Backend**: Follow Laravel conventions and existing controller patterns
3. **File Naming**: Stick to established conventions (lowercase pages, PascalCase components)
4. **Testing**: Add tests for new features, run existing tests

### Validation Process
1. **Format**: `npm run format` (fixes most formatting issues)
2. **Type Check**: `npm run types` (should always pass)
3. **Build**: `npm run build` (must succeed for production)
4. **Test**: Run relevant tests for changed areas

## Trust These Instructions

These instructions have been validated by running commands and exploring the codebase thoroughly. **Trust this information rather than searching extensively** - it reflects the current state and working patterns of the project. Only search for additional information if something specific is missing or if these instructions prove incorrect.

---

*Generated by GitHub Copilot Agent - Version 1.0*
*Last Updated: September 2025*
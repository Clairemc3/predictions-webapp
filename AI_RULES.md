# AI Development Rules for Predictions WebApp

This file contains the coding standards, conventions, and rules that all AI assistants should follow when working on this Laravel/React/TypeScript project.

## 📁 File Naming Conventions

### Frontend (TypeScript/React)
- **All TSX/JSX files which represent pages must use kebab case** (e.g., `login.tsx`, `register.tsx`, `user-page.tsx`, NOT `Login.tsx`, `Register.tsx`). All component and layout files should be PascalCase (e.g. `Header.jsx`, `Footer.jsx`, `ConfirmationDialog.jsx`).
- **Directory names should be lowercase** (e.g., `auth/`, `components/`, NOT `Auth/`, `Components/`)

### Backend (PHP/Laravel)
- Follow PSR-4 autoloading standards
- Controllers use PascalCase (e.g., `AuthenticatedSessionController.php`)
- Models use PascalCase (e.g., `User.php`)
- Migration files follow Laravel naming conventions

## 🚫 React Page Creation Rules

1. **Do NOT create new pages unless explicitly instructed**
2. **Always ask before creating new routes or controllers**
3. **Stick to modifying existing functionality unless specifically asked to add new features**

## 🎨 Frontend Standards

### React Components
- Use functional components with hooks
- Export components as default exports
- Use TypeScript for all components
- Follow the existing component structure pattern

### Material-UI (MUI)
- Use MUI v5 components consistently
- Follow the established theme configuration in `resources/js/theme/muiTheme.ts`
- Use `slotProps` instead of deprecated `InputProps` for TextField components
- Maintain consistent component styling patterns

### Layout Structure
```
resources/js/
├── components/          # Reusable components (lowercase)
├── layouts/            # Layout components (lowercase)
├── pages/              # Page components (lowercase)
│   └── auth/           # Authentication pages (lowercase)
├── theme/              # Theme configuration
└── types/              # TypeScript type definitions
```

### State Management
- Use Inertia.js `useForm` hook for form handling
- Maintain consistent error handling patterns
- Use React hooks for local component state

## 🔧 Backend Standards

### Laravel Structure
- Follow Laravel's directory conventions
- Use Inertia.js for rendering React components
- Maintain RESTful API patterns
- Use proper request validation

### Authentication
- Use Laravel Breeze patterns
- Implement proper middleware for protected routes
- Follow existing controller patterns

## 🎯 Component Patterns

### Form Components
- Use MUI TextField with filled variant
- Include proper validation and error handling
- Use InputAdornment for icons
- Implement password visibility toggles where needed
- Follow the existing form structure pattern

### Navigation
- Use the custom TextLink component for internal navigation
- Maintain consistent link styling
- Use Inertia.js Link component under the hood

### Layout Components
- Use GuestLayout for authentication pages
- Maintain consistent spacing and responsive design
- Follow established AppBar and content wrapper patterns

## 🔄 Development Workflow

### Before Making Changes
1. Check current file structure and naming conventions
2. Read existing code patterns before implementing new features
3. Maintain consistency with established patterns
4. Use existing components and utilities where possible

### Code Quality
- Write TypeScript with proper typing
- Use meaningful variable and function names
- Follow existing code formatting and structure
- Maintain consistent import ordering

### Testing Routes
- Clear Laravel caches when needed: `php artisan config:clear`, `php artisan route:clear`
- Rebuild frontend assets: `npm run build` or `npm run dev`
- Test both development and production builds

## 🚨 Critical Rules

1. **NEVER change file naming conventions without explicit permission (pages should be kebab-case, components/layouts should be PascalCase)**
2. **ALWAYS preserve existing functionality when making modifications**
3. **DO NOT create new pages/routes without specific instruction**
4. **MAINTAIN the established MUI theming and component patterns**
5. **USE the existing import paths and component structure**

## 📦 Technology Stack

- **Backend**: Laravel 11, PHP 8.2+, SQLite
- **Frontend**: React 18, TypeScript, Vite
- **UI Library**: Material-UI (MUI) v5
- **Routing**: Inertia.js
- **Styling**: MUI Theme System + Tailwind (for utilities)
- **State**: Inertia.js useForm + React hooks

## 🎨 Theme Configuration

- **Primary Colors**: Purple theme (`#6b46c1`)
- **Secondary Colors**: Yellow accent (`#f59e0b`)
- **Typography**: Archivo Black (headings), Carme (body)
- **Component Variants**: Filled inputs, contained buttons
- **Layout**: Centered cards with proper spacing

## 📋 Current Project Structure

This is a predictions tracking web application with:
- User authentication (login/register)
- Guest layout for auth pages
- Dashboard for authenticated users
- MUI component library integration
- Laravel backend with Inertia.js frontend

## 🔗 File References

Key files to reference when working on this project:
- `resources/js/theme/muiTheme.ts` - Theme configuration
- `resources/js/layouts/guest-layout.tsx` - Guest layout pattern
- `resources/js/components/TextLink.tsx` - Link component pattern
- `routes/web.php` - Route definitions
- `routes/auth.php` - Authentication routes

---

**Last Updated**: August 12, 2025
**Version**: 1.0

*This file should be referenced by all AI assistants working on this project to maintain consistency and follow established patterns.*

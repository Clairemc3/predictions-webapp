# GitHub Copilot Instructions for Predictions WebApp

This file contains coding standards, conventions, and rules for AI assistants working on this Laravel/React/TypeScript project.

## 📁 File Naming Conventions

### Frontend (TypeScript/React)
- **All TSX/JSX files which represent pages must use kebab case** (e.g., `login.tsx`, `register.tsx`, `user-page.tsx`, NOT `Login.tsx`, `Register.tsx`). All component and layout files should be PascalCase (e.g. `Header.jsx`, `Footer.jsx`, `ConfirmationDialog.jsx`).
- **Directory names should be lowercase** (e.g., `auth/`, `components/`, NOT `Auth/`, `Components/`)
- **Component file names should match the component name but in lowercase**

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

## 🚨 Critical Rules

1. **NEVER change file naming from lowercase to uppercase without explicit permission**
2. **ALWAYS preserve existing functionality when making modifications**
3. **DO NOT create new pages/routes without specific instruction**
4. **MAINTAIN the established MUI theming and component patterns**
5. **USE the existing import paths and component structure**
6. **Do not implement methods for features which are outside of the scope of the active prompt**


**Last Updated**: August 12, 2025
**Version**: 1.0

*This file is automatically referenced by GitHub Copilot and other AI assistants to maintain consistency across the codebase.*

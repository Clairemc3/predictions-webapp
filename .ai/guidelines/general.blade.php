# GitHub Copilot Instructions for Predictions WebApp

This file contains coding standards, conventions, and rules for AI assistants working on this Laravel/React/TypeScript project.

## 📁 File Naming Conventions

### Frontend (TypeScript/React)
- **All TSX/JSX files which represent pages must use kebab case** (e.g., `login.tsx`, `register.tsx`, `user-page.tsx`, NOT `Login.tsx`, `Register.tsx`). All component and layout files should be PascalCase (e.g. `Header.jsx`, `Footer.jsx`, `ConfirmationDialog.jsx`).
- **Directory names should be lowercase** (e.g., `auth/`, `components/`, NOT `Auth/`, `Components/`)
- **Component file names should match the component name but in lowercase**
 - Use the ConfirmationDialog component in `ConfirmationDialog.tsx` for daliogs confirming updating or deleting an entity.

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

### State Management
- Use Inertia.js `useForm` hook for form handling
- Maintain consistent error handling patterns
- Use React hooks for local component state


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


### Useful Artisan commands to help with tasks
Use ```php artisan schedule:list``` to look for scheduled commands and scheduled jobs


### Permisisons in the front end
Models sent to the front end via inertia/axios shoukd include a permissions object with boolean
values for each action the user can take on that model, e.g.
'permissions': {
   'canUpdateQuestion': true,
   'canDeleteQuestion': false,
   'canViewQuestion': true
}


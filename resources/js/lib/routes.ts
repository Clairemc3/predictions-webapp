/**
 * Route building utility for generating URL paths
 * This provides a centralized way to build routes without exposing all routes to the frontend
 */

interface RouteParams {
  [key: string]: string | number;
}

/**
 * Build a route URL based on the route name and parameters
 * @param name - The route name (e.g., 'users.permissions.toggle')
 * @param params - The route parameters
 * @returns The built URL path
 */
export const buildRoute = (name: string, params: RouteParams = {}): string => {
  switch (name) {
    case 'users.permissions.toggle':
      return `/users/${params.user}/permissions/${params.permission}/toggle`;
    
    case 'users.index':
      return '/users';
    
    case 'seasons.manage':
      return `/seasons/${params.season}`;
    
    case 'seasons.show':
      return `/seasons/${params.season}`;
    
    default:
      console.warn(`Unknown route name: ${name}`);
      return '';
  }
};

/**
 * Type-safe route names
 */
export type RouteName = 
  | 'users.permissions.toggle'
  | 'users.permissions.grant' 
  | 'users.permissions.revoke'
  | 'users.index'
  | 'seasons.manage'
  | 'seasons.show';

/**
 * Type-safe version of buildRoute
 */
export const route = (name: RouteName, params: RouteParams = {}): string => {
  return buildRoute(name, params);
};

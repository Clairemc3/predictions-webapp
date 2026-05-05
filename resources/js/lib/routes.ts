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
      return `/admin/users/${params.user}/permissions/${params.permission}/toggle`;
    
    case 'users.index':
      return '/admin/users';
    
    case 'seasons.manage':
      return `/seasons/${params.season}`;
    
    case 'seasons.show':
      return `/seasons/${params.season}`;

    case 'seasons.status.update':
      return `/seasons/${params.season}/status`;
    
    case 'seasons.questions.results.manage':
      return `/seasons/${params.season}/questions/${params.question}/results`;
    
    case 'seasons.questions.results.store':
      return `/seasons/${params.season}/questions/${params.question}/results`;
    
    case 'seasons.questions.results.complete':
      return `/seasons/${params.season}/questions/${params.question}/results/complete`;
    
    case 'seasons.questions.results.update':
      return `/seasons/${params.season}/questions/${params.question}/results/${params.result}`;
    
    case 'seasons.questions.results.reorder':
      return `/seasons/${params.season}/questions/${params.question}/results/reorder`;
    
    case 'seasons.questions.results.destroy':
      return `/seasons/${params.season}/questions/${params.question}/results/${params.result}`;
    
    case 'admin.question-types.index':
      return '/admin/question-types';
    
    case 'admin.question-types.create':
      return '/admin/question-types/create';
    
    case 'admin.question-types.store':
      return '/admin/question-types';
    
    case 'admin.question-types.edit':
      return `/admin/question-types/${params.id}/edit`;
    
    case 'admin.question-types.update':
      return `/admin/question-types/${params.id}`;
    
    case 'admin.question-types.destroy':
      return `/admin/question-types/${params.id}`;
    
    case 'profile.picture.upload':
      return '/profile/picture';
    
    case 'profile.picture.delete':
      return '/profile/picture';
    
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
  | 'seasons.show'
  | 'seasons.status.update'
  | 'seasons.questions.results.manage'
  | 'seasons.questions.results.store'
  | 'seasons.questions.results.complete'
  | 'seasons.questions.results.update'
  | 'seasons.questions.results.reorder'
  | 'seasons.questions.results.destroy'
  | 'admin.question-types.index'
  | 'admin.question-types.create'
  | 'admin.question-types.store'
  | 'admin.question-types.edit'
  | 'admin.question-types.update'
  | 'admin.question-types.destroy'
  | 'profile.picture.upload'
  | 'profile.picture.delete';

/**
 * Type-safe version of buildRoute
 */
export const route = (name: RouteName, params: RouteParams = {}): string => {
  return buildRoute(name, params);
};

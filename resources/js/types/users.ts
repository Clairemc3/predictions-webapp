export interface User {
  id: number;
  name: string;
  email: string;
  email_verified: boolean;
  can_host: boolean;
  can_toggle_permission: boolean;
  seasons_count: number;
}

export interface PaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface PaginatedUsers {
  data: User[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
  from: number;
  to: number;
  links: PaginationLink[];
}

export interface Filters {
  search: string;
}

export interface UsersIndexProps {
  users: PaginatedUsers;
  filters: Filters;
  isAdmin?: boolean;
  [key: string]: any;
}

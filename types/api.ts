//types/api.ts
export interface PaginationMeta {
  current_page?: number;
  last_page?: number;
  total?: number;
  per_page?: number;
  from?: number;
  to?: number;
  next_page?: string | null;
  prev_page?: string | null;
  path?: string;
}
export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
  meta?: PaginationMeta;
}

export interface ApiFetchOptions extends Omit<RequestInit, "body"> {
  token?: string;
  orgId?: string;
  params?: Record<string, string | number | boolean | undefined>;
  body?: unknown;
}
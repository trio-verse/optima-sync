export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: Record<string, string[] | string>;
  meta?: {
    currentPage: number;
    lastPage: number;
    total: number;
  };
}

export interface ApiFetchOptions extends RequestInit {
  orgId?: string;
  params?: Record<string, string | number | boolean | undefined>;
}
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import type { ApiFetchOptions } from "@/types/api";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://optima.trio-verse.com/api/v1";

export class ApiError extends Error {
  status: number;
  data: unknown;

  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error) {
    return error.message || fallback;
  }

  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error
  ) {
    const errorData = (error as { data?: unknown }).data;

    if (
      typeof errorData === "object" &&
      errorData !== null &&
      "message" in errorData &&
      typeof (errorData as { message?: unknown }).message === "string"
    ) {
      return (errorData as { message: string }).message;
    }
  }

  return fallback;
}

export function getStatusMessage(
  status: number,
  fallback = "An unexpected error occurred"
): string {
  switch (status) {
    case 400:
      return "The request is invalid.";

    case 401:
      return "Your session has expired. Please log in again.";

    case 403:
      return "You do not have permission to perform this action.";

    case 404:
      return "The requested resource was not found.";

    case 409:
      return "This action conflicts with the current data.";

    case 422:
      return "The provided data is invalid. Please check your input.";

    case 429:
      return "Too many requests. Please try again later.";

    case 500:
      return "A server error occurred. Please try again later.";

    case 502:
      return "The server is temporarily unavailable.";

    case 503:
      return "The service is temporarily unavailable. Please try again later.";

    case 504:
      return "The server took too long to respond. Please try again.";

    default:
      return fallback;
  }
} 

function isExpiringSoon(token: string): boolean {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp - Date.now() / 1000 < 172800 : false;
  } catch {
    return true;
  }
}

async function refreshToken(oldToken: string): Promise<string | null> {
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${oldToken}`,
        "Content-Type": "application/json",
      },
    });

    if (!res.ok) return null;

    const data = await res.json();
    const newToken = data?.data?.token || data?.token || data?.access_token;

    if (newToken) {
      const cookieStore = await cookies();
      cookieStore.set("token", newToken, {
        path: "/",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        sameSite: "lax",
      });
      return newToken;
    }
    return null;
  } catch {
    return null;
  }
}

export async function apiFetch(
  endpoint: string,
  options: ApiFetchOptions = {},
) {
  const {
    method = "GET",
    headers = {},
    body,
    token: customToken,
    params,
    ...customConfig
  } = options;

  const cookieStore = await cookies();
  let token = customToken || cookieStore.get("token")?.value;

  if (token && isExpiringSoon(token)) {
    const newToken = await refreshToken(token);
    if (newToken) token = newToken;
  }

  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      searchParams.append(key, String(value));
    });
    url += `?${searchParams}`;
  }

  const isFormData = body instanceof FormData;

  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };

  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    ...customConfig,
  };

  try {
    let response = await fetch(url, config);

    // if (response.status === 401 && token) {
    //   const newToken = await refreshToken(token);
    //   if (newToken) {
    //     (config.headers as Record<string, string>).Authorization =
    //       `Bearer ${newToken}`;
    //     response = await fetch(url, config);
    //   } else {
    //     cookieStore.delete("token");
    //     redirect("/register");
    //   }
    // }

    if (response.status === 204) {
      return { status: 204, data: null };
    }

    const data = await response.json().catch(() => ({}));

    const result = {
      status: response.status,
      data: data,
    };

    if (!response.ok) {
      const error = new ApiError(
        `   Error : ${response.status}`,
        response.status,
        data,
      );

      throw error;
    }

    return result;
  } catch (error) {
    console.error(
      `[API Error] ${method} ${url}:`,
      error instanceof Error ? error.message : error,
    );

   return {
      status: error instanceof ApiError ? error.status : 500,
      data: {
        message: getErrorMessage(error, "An unexpected error occurred"),
      },
    };
  }
}

export const api = {
  get: (endpoint: string, options: ApiFetchOptions = {}) =>
    apiFetch(endpoint, { ...options, method: "GET" }),

  post: (endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetch(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put: (endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetch(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  patch: (endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetch(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete: (endpoint: string, options: ApiFetchOptions = {}) =>
    apiFetch(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
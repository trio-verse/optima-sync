import { ApiFetchOptions } from "@/types";
import { cookies } from "next/headers";
const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://optima.trio-verse.com/api/v1";

export async function apiFetchV2<T>(
  endpoint: string,
  options: ApiFetchOptions = {},
):Promise<T> {
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
  let url = `${BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  const defaultHeaders: Record<string, string> = {
    Accept: "application/json",
    ...({ "Content-Type": "application/json" }),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers as Record<string, string>),
  };
  const config: RequestInit = {
    method,
    headers: defaultHeaders,
    body: body,
    ...customConfig,
  };

  try {
    let response = await fetch(url, config);
    const data = await response.json();
    if (!response.ok) throw new Error("failed to Fetch"); 
    return data as T;
  } catch (error) {
    throw new Error(error); 
  }
}

export const apiV2 = {
  get: async <T>(endpoint: string, options: ApiFetchOptions = {}) =>
   await apiFetchV2(endpoint, { ...options, method: "GET" }),

  post:async <T>(endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetchV2(endpoint, {
      ...options,
      method: "POST",
      body,
    }),

  put:async <T>(endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetchV2(endpoint, {
      ...options,
      method: "PUT",
      body,
    }),

  patch:async <T>(endpoint: string, body?: unknown, options: ApiFetchOptions = {}) =>
    apiFetchV2(endpoint, {
      ...options,
      method: "PATCH",
      body,
    }),

  delete:async (endpoint: string, options: ApiFetchOptions = {}) =>
    apiFetchV2(endpoint, {
      ...options,
      method: "DELETE",
    }),
};
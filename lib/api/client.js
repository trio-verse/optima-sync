// lib/api/client.js

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://optima.trio-verse.com/api/v1";

function isExpiringSoon(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp - Date.now() / 1000 < 172800 : false;
  } catch {
    return true;
  }
}

async function refreshToken(oldToken) {
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

export async function apiFetch(endpoint, options = {}) {
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
    const searchParams = new URLSearchParams(params).toString();
    url += `?${searchParams}`;
  }

  const defaultHeaders = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...headers,
  };

  const isFormData = body instanceof FormData;
  if (isFormData) {
    delete defaultHeaders["Content-Type"];
  }

  const config = {
    method,
    headers: defaultHeaders,
    body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    ...customConfig,
  };

  try {
    let response = await fetch(url, config);

    if (response.status === 401 && token) {
      const newToken = await refreshToken(token);
      if (newToken) {
        config.headers.Authorization = `Bearer ${newToken}`;
        response = await fetch(url, config);
      } else {
        cookieStore.delete("token");
        redirect("/register");
      }
    }
if (response.status === 204) {
      return { status: 204, data: null };
    }

    const data = await response.json().catch(() => ({}));


  const result = {
      status: response.status,
      data: data,
    };
    if (!response.ok) {
      const error = new Error(
        `data.message  حدث خطأ في الطلب: ${response.status}`,
      );
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return result;
  } catch (error) {
    console.error(`[API Error] ${method} ${url}:`, error.message);
    throw error;
  }
}

export const api = {
  get: (endpoint, options) => apiFetch(endpoint, { ...options, method: "GET" }),
  post: (endpoint, body, options) =>
    apiFetch(endpoint, { ...options, method: "POST", body }),
  put: (endpoint, body, options) =>
    apiFetch(endpoint, { ...options, method: "PUT", body }),
  patch: (endpoint, body, options) =>
    apiFetch(endpoint, { ...options, method: "PATCH", body }),
  delete: (endpoint, options) =>
    apiFetch(endpoint, { ...options, method: "DELETE" }),
};

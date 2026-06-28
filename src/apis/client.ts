const BASE_URL = import.meta.env.VITE_API_BASE_URL;

type RequestOptions = Omit<RequestInit, "body"> & { body?: unknown };

async function request<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const { body, ...init } = options;

  const response = await fetch(`${BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init.headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export const client = {
  get: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "GET" }),
  post: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "POST", body }),
  put: <T>(path: string, body: unknown, init?: RequestInit) =>
    request<T>(path, { ...init, method: "PUT", body }),
  delete: <T>(path: string, init?: RequestInit) =>
    request<T>(path, { ...init, method: "DELETE" }),
};

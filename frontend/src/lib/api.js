export class ApiError extends Error {
  constructor(status, code, message, details) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

let unauthorizedHandler = null;

export const onUnauthorized = (handler) => {
  unauthorizedHandler = handler;
};

export async function api(path, { method = "GET", body, signal } = {}) {
  let res;
  try {
    res = await fetch(`/api${path}`, {
      method,
      signal,
      credentials: "same-origin",
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    throw new ApiError(0, "NETWORK_ERROR", err.message);
  }

  const data = await res.json().catch(() => null);

  if (!res.ok) {
    if (res.status === 401 && unauthorizedHandler && !path.startsWith("/auth/")) {
      unauthorizedHandler();
    }
    throw new ApiError(res.status, data?.code || "INTERNAL_ERROR", data?.message || res.statusText, data?.details);
  }

  return data;
}

export const toQuery = (params) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") query.set(key, value);
  });
  const result = query.toString();
  return result ? `?${result}` : "";
};

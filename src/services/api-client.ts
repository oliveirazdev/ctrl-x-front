import type { ZodType } from "zod";

export class ApiError extends Error {
  constructor(public readonly status: number) {
    super(`A requisição falhou (HTTP ${status}).`);
    this.name = "ApiError";
  }
}

export async function fetchJson<T>(
  url: string | URL,
  schema: ZodType<T>,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers);
  headers.set("Accept", "application/json");
  const response = await fetch(url, { ...options, headers, cache: "no-store" });
  if (!response.ok) throw new ApiError(response.status);
  const data: unknown = await response.json();
  return schema.parse(data);
}

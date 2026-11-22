import { ApiError } from "./api-client.ts";

export async function checkApiHealth(
  apiUrl: string,
  signal?: AbortSignal,
): Promise<number> {
  const response = await fetch(new URL("/health", apiUrl), {
    signal,
    cache: "no-store",
  });
  if (!response.ok) throw new ApiError(response.status);
  return response.status;
}

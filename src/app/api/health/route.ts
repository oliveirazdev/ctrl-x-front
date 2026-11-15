import { fetchJson } from "@/services/api-client";
import { healthSchema } from "@/types/health";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    if (!baseUrl) throw new Error("API base URL is missing.");
    // The backend health endpoint is at the origin root, outside /api/v1.
    const health = await fetchJson(new URL("/health", baseUrl), healthSchema, {
      signal: AbortSignal.timeout(5000),
    });
    return Response.json(health, { headers: { "Cache-Control": "no-store" } });
  } catch {
    return Response.json(
      { message: "Serviço indisponível no momento." },
      { status: 503, headers: { "Cache-Control": "no-store" } },
    );
  }
}

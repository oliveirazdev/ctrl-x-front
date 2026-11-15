import assert from "node:assert/strict";
import { test } from "node:test";
import { fetchJson, ApiError } from "../src/services/api-client.ts";
import { healthSchema } from "../src/types/health.ts";

test("HTTP client validates health responses and prevents caching", async (context) => {
  context.mock.method(globalThis, "fetch", async (_url: string, options: RequestInit) => {
    assert.equal(options.cache, "no-store");
    assert.equal(new Headers(options.headers).get("Accept"), "application/json");
    return Response.json({ status: "ok" });
  });
  assert.deepEqual(await fetchJson("http://localhost/health", healthSchema), { status: "ok" });
});

test("HTTP client rejects unsuccessful responses", async (context) => {
  context.mock.method(globalThis, "fetch", async () => new Response(null, { status: 503 }));
  await assert.rejects(fetchJson("http://localhost/health", healthSchema), (error) => error instanceof ApiError && error.status === 503);
});

test("HTTP client rejects incompatible API responses", async (context) => {
  context.mock.method(globalThis, "fetch", async () => Response.json({ status: "unexpected" }));
  await assert.rejects(fetchJson("http://localhost/health", healthSchema));
});

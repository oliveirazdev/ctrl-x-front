import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ApiHealth } from "../src/features/system/api-health.tsx";
import { checkApiHealth } from "../src/services/health.ts";
import { ApiError } from "../src/services/api-client.ts";

test("health check treats a successful HTTP response as connected without parsing its body", async (context) => {
  context.mock.method(globalThis, "fetch", async (url: URL, options: RequestInit) => {
    assert.equal(url.toString(), "http://localhost:8000/health");
    assert.equal(options.cache, "no-store");
    return new Response("OK", { status: 200 });
  });

  assert.equal(await checkApiHealth("http://localhost:8000/api/v1"), 200);
});

test("health check preserves unsuccessful HTTP status", async (context) => {
  context.mock.method(globalThis, "fetch", async () =>
    new Response(null, { status: 503 }),
  );

  await assert.rejects(
    checkApiHealth("http://localhost:8000/api/v1"),
    (error) => error instanceof ApiError && error.status === 503,
  );
});

test("health status renders a successful response as connected", () => {
  const client = new QueryClient();
  client.setQueryData(["system", "health"], 200);
  const html = renderToStaticMarkup(
    createElement(
      QueryClientProvider,
      { client },
      createElement(ApiHealth),
    ),
  );

  assert.match(html, /Conectado à API\./);
  client.clear();
});

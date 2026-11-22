import assert from "node:assert/strict";
import { test } from "node:test";
import { getApiHealthUrl } from "../src/features/system/api-health-url.ts";

test("health check uses the configured API URL host", () => {
  const previous = process.env.NEXT_PUBLIC_API_URL;
  process.env.NEXT_PUBLIC_API_URL = "https://api.example.test/api/v1";
  try {
    assert.equal(getApiHealthUrl().href, "https://api.example.test/health");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = previous;
  }
});

test("health check reports when the API URL is not configured", () => {
  const previous = process.env.NEXT_PUBLIC_API_URL;
  delete process.env.NEXT_PUBLIC_API_URL;
  try {
    assert.throws(getApiHealthUrl, /Endereço da API não configurado/);
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_API_URL;
    else process.env.NEXT_PUBLIC_API_URL = previous;
  }
});

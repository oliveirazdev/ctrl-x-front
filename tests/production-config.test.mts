import assert from "node:assert/strict";
import { test } from "node:test";
import { validateProductionUrl } from "../scripts/validate-production-config.mjs";

test("accepts canonical HTTPS origins with optional trailing slash", () => {
  assert.equal(validateProductionUrl("https://app.example.com").error, undefined);
  assert.equal(validateProductionUrl("https://app.example.com/").error, undefined);
});

const invalidUrls = [
  [undefined, "unavailable"],
  ["", "unavailable"],
  ["app.example.com", "valid absolute URL"],
  ["http://app.example.com", "HTTPS"],
  ["https://user:pass@app.example.com", "credentials"],
  ["https://app.example.com/path", "origin only"],
  ["https://app.example.com/?x=1", "query string"],
  ["https://app.example.com/#section", "fragment"],
  [" https://app.example.com", "whitespace"],
  ["https://app.example.com\n", "whitespace"],
];

for (const [value, expected] of invalidUrls) {
  test(`rejects invalid production URL (${expected})`, () => {
    assert.match(validateProductionUrl(value).error ?? "", new RegExp(expected!, "iu"));
  });
}

test("frontend health route returns uncached local health without API configuration", async () => {
  const { GET } = await import("../src/app/api/health/route.ts");
  const previous = process.env.NEXT_PUBLIC_API_BASE_URL;
  delete process.env.NEXT_PUBLIC_API_BASE_URL;
  try {
    const response = GET();
    assert.equal(response.status, 200);
    assert.deepEqual(await response.json(), { status: "ok" });
    assert.equal(response.headers.get("cache-control"), "no-store");
  } finally {
    if (previous === undefined) delete process.env.NEXT_PUBLIC_API_BASE_URL;
    else process.env.NEXT_PUBLIC_API_BASE_URL = previous;
  }
});

import assert from "node:assert/strict";
import { test } from "node:test";
import { authRequest, AuthError, credentialsSchema, dashboardPath, registrationSchema } from "../src/features/auth/auth.ts";

test("registration validates password, confirmation and required name", () => {
  const input = { email: "patient@example.test", password: "valid-password-123", confirmation: "valid-password-123", full_name: "Person", role: "PATIENT" };
  assert.equal(registrationSchema.safeParse(input).success, true);
  assert.equal(registrationSchema.safeParse({ ...input, confirmation: "different" }).success, false);
  assert.equal(registrationSchema.safeParse({ ...input, full_name: "  " }).success, false);
  assert.equal(credentialsSchema.safeParse({ email: "invalid", password: "short" }).success, false);
});

test("authentication sends credentials and validates the API response", async (context) => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api/v1";
  context.mock.method(globalThis, "fetch", async (url: string | URL | Request, init?: RequestInit) => {
    assert.equal(url, "http://localhost:8000/api/v1/auth/login");
    assert.equal(init?.credentials, "include");
    assert.equal(init?.method, "POST");
    return Response.json({ id: "00000000-0000-4000-8000-000000000001", email: "patient@example.test", role: "PATIENT" });
  });
  const user = await authRequest("login", { email: "patient@example.test", password: "valid-password-123" });
  assert.equal(dashboardPath(user.role), "/patient/dashboard");
  assert.equal(dashboardPath("PROFESSIONAL"), "/professional/dashboard");
});

test("API errors preserve status and message", async (context) => {
  process.env.NEXT_PUBLIC_API_URL = "http://localhost:8000/api/v1";
  context.mock.method(globalThis, "fetch", async () => Response.json({ detail: "Not authenticated" }, { status: 401 }));
  await assert.rejects(authRequest("me"), (error) => error instanceof AuthError && error.status === 401 && error.message === "Not authenticated");
});

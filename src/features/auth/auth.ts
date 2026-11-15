import { z } from "zod";

export const userSchema = z.object({ id: z.string().uuid(), email: z.string().email(), role: z.enum(["PATIENT", "PROFESSIONAL"]) });
export type User = z.infer<typeof userSchema>;
export const credentialsSchema = z.object({
  email: z.string().trim().toLowerCase().email("Informe um e-mail válido.").max(254),
  password: z.string().min(12, "Use pelo menos 12 caracteres.").max(128, "Use no máximo 128 caracteres."),
});
export const registrationSchema = credentialsSchema.extend({
  full_name: z.string().trim().min(1, "Informe seu nome.").max(200),
  role: z.enum(["PATIENT", "PROFESSIONAL"]),
  confirmation: z.string(),
}).refine((data) => data.password === data.confirmation, { path: ["confirmation"], message: "As senhas não coincidem." });

export class AuthError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

export async function authRequest(path: "login" | "register" | "me", body?: object): Promise<User> {
  const base = process.env.NEXT_PUBLIC_API_URL;
  if (!base) throw new Error("Endereço da API não configurado.");
  const response = await fetch(`${base.replace(/\/$/, "")}/auth/${path}`, {
    method: body ? "POST" : "GET", credentials: "include", cache: "no-store",
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!response.ok) {
    const payload: unknown = await response.json().catch(() => null);
    const detail = z.object({ detail: z.string() }).safeParse(payload);
    throw new AuthError(response.status, detail.success ? detail.data.detail : "Não foi possível concluir a solicitação.");
  }
  return userSchema.parse(await response.json());
}

export function dashboardPath(role: User["role"]) {
  return role === "PATIENT" ? "/patient/dashboard" : "/professional/dashboard";
}

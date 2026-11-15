"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { authRequest, credentialsSchema, dashboardPath, registrationSchema } from "./auth";
import styles from "./form.module.css";

type Values = z.input<typeof registrationSchema>;
export function AuthForm({ register: isRegister }: { register: boolean }) {
  const router = useRouter();
  const params = useSearchParams();
  const [message, setMessage] = useState("");
  const session = useQuery({ queryKey: ["auth", "me"], queryFn: () => authRequest("me"), retry: false, staleTime: 0 });
  useEffect(() => { if (session.data) router.replace(dashboardPath(session.data.role)); }, [router, session.data]);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Values>({
    resolver: zodResolver(isRegister ? registrationSchema : credentialsSchema) as never,
    defaultValues: { email: "", password: "", full_name: "", confirmation: "", role: "PATIENT" },
  });
  async function submit(values: Values) {
    setMessage("");
    try {
      if (isRegister) {
        await authRequest("register", { email: values.email.trim().toLowerCase(), password: values.password, full_name: values.full_name.trim(), role: values.role });
        router.push("/login?registered=1");
      } else {
        const user = await authRequest("login", { email: values.email.trim().toLowerCase(), password: values.password });
        router.replace(dashboardPath(user.role));
      }
    } catch (error) { setMessage(error instanceof Error ? error.message : "Erro de conexão."); }
  }
  if (session.isPending || session.data) return <p role="status">Verificando sua sessão…</p>;
  return <div className={styles.card}>
    <h1>{isRegister ? "Criar conta" : "Entrar"}</h1>
    {params.get("registered") && <p role="status">Cadastro concluído. Entre para acessar sua conta.</p>}
    {params.get("expired") && <p role="status">Sua sessão expirou ou você ainda não entrou. Entre novamente.</p>}
    {message && <p role="alert">{message}</p>}
    <form onSubmit={handleSubmit(submit)} noValidate>
      {isRegister && <><label htmlFor="full_name">Nome completo</label><input id="full_name" autoComplete="name" aria-invalid={!!errors.full_name} aria-describedby="name-error" {...register("full_name")} /><span id="name-error">{errors.full_name?.message}</span>
        <label htmlFor="role">Perfil</label><select id="role" {...register("role")}><option value="PATIENT">Paciente</option><option value="PROFESSIONAL">Profissional</option></select></>}
      <label htmlFor="email">E-mail</label><input id="email" type="email" autoComplete="email" aria-invalid={!!errors.email} aria-describedby="email-error" {...register("email")} /><span id="email-error">{errors.email?.message}</span>
      <label htmlFor="password">Senha</label><input id="password" type="password" autoComplete={isRegister ? "new-password" : "current-password"} aria-invalid={!!errors.password} aria-describedby="password-error" {...register("password")} /><span id="password-error">{errors.password?.message}</span>
      {isRegister && <><label htmlFor="confirmation">Confirme a senha</label><input id="confirmation" type="password" autoComplete="new-password" aria-invalid={!!errors.confirmation} aria-describedby="confirmation-error" {...register("confirmation")} /><span id="confirmation-error">{errors.confirmation?.message}</span></>}
      <button disabled={isSubmitting}>{isSubmitting ? "Aguarde…" : isRegister ? "Cadastrar" : "Entrar"}</button>
    </form>
    <p><Link href={isRegister ? "/login" : "/register"}>{isRegister ? "Já tenho conta" : "Criar conta"}</Link></p>
  </div>;
}

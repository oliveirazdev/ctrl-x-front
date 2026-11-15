"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ContentState } from "@/components/ui/content-state";
import ui from "@/components/ui/ui.module.css";
import styles from "./dashboard.module.css";
import { authRequest, AuthError, dashboardPath, type User } from "./auth";

export function Dashboard({ role }: { role: User["role"] }) {
  const router = useRouter();
  const query = useQuery({ queryKey: ["auth", "me"], queryFn: () => authRequest("me"), retry: false, staleTime: 0, refetchOnWindowFocus: true });
  useEffect(() => {
    if (query.error instanceof AuthError && query.error.status === 401) router.replace("/login?expired=1");
    else if (query.data && query.data.role !== role) router.replace(dashboardPath(query.data.role));
  }, [query.data, query.error, role, router]);
  if (query.isPending || (query.error instanceof AuthError && query.error.status === 401) || (query.data && query.data.role !== role)) return <ContentState kind="loading" title="Verificando sua sessão"><p>Estamos preparando seu espaço de cuidado.</p></ContentState>;
  if (query.isError) return <ContentState kind="error" title="Não foi possível verificar sua sessão"><p>Confira sua conexão e tente novamente.</p><Button disabled={query.isFetching} onClick={() => void query.refetch()}>{query.isFetching ? "Verificando…" : "Tentar novamente"}</Button></ContentState>;
  const patient = role === "PATIENT";
  return <section aria-labelledby="dashboard-title">
    <div className={styles.header}><div><p className={ui.eyebrow}>Meu espaço · Ctrl X</p><h1 id="dashboard-title">{patient ? "Seu cuidado começa aqui." : "Um espaço para acompanhar."}</h1><p>{patient ? "Bem-vindo à sua área de acompanhamento de saúde." : "Bem-vindo à sua área profissional de cuidado."}</p></div><span className={styles.badge}>{patient ? "Área do paciente" : "Área do profissional"}</span></div>
    <div className={styles.layout}><ContentState title="Seu espaço está em preparação"><p>{patient ? "As ferramentas para acompanhar seu histórico de saúde estarão disponíveis aqui. Por enquanto, seu acesso à conta já está pronto." : "As ferramentas para acompanhar pacientes e registrar o cuidado estarão disponíveis aqui. Por enquanto, seu acesso à conta já está pronto."}</p></ContentState>
    <aside className={styles.account} aria-labelledby="account-title"><h2 id="account-title">Sua conta</h2><dl><dt>E-mail</dt><dd>{query.data.email}</dd><dt>Perfil de acesso</dt><dd>{patient ? "Paciente" : "Profissional"}</dd></dl></aside></div>
  </section>;
}

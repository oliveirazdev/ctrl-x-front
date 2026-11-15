"use client";

import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { authRequest, AuthError, dashboardPath, type User } from "./auth";

export function Dashboard({ role }: { role: User["role"] }) {
  const router = useRouter();
  const query = useQuery({ queryKey: ["auth", "me"], queryFn: () => authRequest("me"), retry: false, staleTime: 0, refetchOnWindowFocus: true });
  useEffect(() => {
    if (query.error instanceof AuthError && query.error.status === 401) router.replace("/login?expired=1");
    else if (query.data && query.data.role !== role) router.replace(dashboardPath(query.data.role));
  }, [query.data, query.error, role, router]);
  if (query.isPending || (query.error instanceof AuthError && query.error.status === 401) || (query.data && query.data.role !== role)) return <p role="status">Verificando sua sessão…</p>;
  if (query.isError) return <div role="alert"><p>Não foi possível verificar sua sessão.</p><button onClick={() => void query.refetch()}>Tentar novamente</button></div>;
  return <section><h1>{role === "PATIENT" ? "Área do paciente" : "Área do profissional"}</h1><p>Conta: {query.data.email}</p></section>;
}

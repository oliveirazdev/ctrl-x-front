"use client";

import { useQuery } from "@tanstack/react-query";
import { checkApiHealth } from "@/services/health";
import styles from "./api-health.module.css";
import { Button } from "@/components/ui/button";

export function ApiHealth() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const { isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["system", "health"],
    queryFn: ({ signal }) => {
      if (!apiUrl) throw new Error("Endereço da API não configurado.");
      return checkApiHealth(apiUrl, signal);
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  const state = isPending ? "checking" : isError ? "error" : "connected";
  const message = isPending
    ? "Verificando conexão…"
    : isError
      ? "Não foi possível conectar ao serviço. Tente novamente em instantes."
      : "Conectado à API.";

  return (
    <div className={styles.status} data-state={state}>
      <p role="status" aria-live="polite">{message}</p>
      <Button variant="secondary" type="button" disabled={isFetching} onClick={() => void refetch()}>
        {isFetching ? "Verificando…" : "Verificar novamente"}
      </Button>
    </div>
  );
}

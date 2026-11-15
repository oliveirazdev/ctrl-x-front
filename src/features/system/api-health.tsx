"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/services/api-client";
import { healthSchema } from "@/types/health";
import styles from "./api-health.module.css";
import { Button } from "@/components/ui/button";

export function ApiHealth() {
  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
  const { isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["system", "health"],
    queryFn: ({ signal }) => {
      if (!apiBaseUrl) throw new Error("API base URL is not configured.");
      return fetchJson(new URL("/health", apiBaseUrl), healthSchema, { signal });
    },
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  let message = "Serviço disponível.";
  if (isPending) message = "Verificando conexão…";
  else if (isError) message = "Não foi possível conectar ao serviço. Tente novamente em instantes.";

  return (
    <div className={styles.status}>
      <p role="status" aria-live="polite">{message}</p>
      <Button variant="secondary" type="button" disabled={isFetching} onClick={() => void refetch()}>
        {isFetching ? "Verificando…" : "Verificar novamente"}
      </Button>
    </div>
  );
}

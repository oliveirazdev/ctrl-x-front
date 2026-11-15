"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchJson } from "@/services/api-client";
import { healthSchema } from "@/types/health";
import styles from "./api-health.module.css";

export function ApiHealth() {
  const { isPending, isError, isFetching, refetch } = useQuery({
    queryKey: ["system", "health"],
    queryFn: ({ signal }) => fetchJson("/api/health", healthSchema, { signal }),
    staleTime: 30_000,
    refetchOnWindowFocus: false,
  });
  let message = "Serviço disponível.";
  if (isPending) message = "Verificando conexão…";
  else if (isError) message = "Não foi possível conectar ao serviço. Tente novamente em instantes.";

  return (
    <div>
      <p role="status" aria-live="polite">{message}</p>
      <button className={styles.button} type="button" disabled={isFetching} onClick={() => void refetch()}>
        {isFetching ? "Verificando…" : "Verificar novamente"}
      </button>
    </div>
  );
}

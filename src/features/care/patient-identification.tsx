"use client";

import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import { getPatient } from "@/services/care";
import { useCare, useSessionError } from "./care-area";
import { CareError, CareLoading } from "./states";
import styles from "./care.module.css";

export function PatientIdentification({ patientId }: { patientId: string }) {
  const { user } = useCare();
  const query = useQuery({ queryKey: ["care", user.id, "patient", patientId], queryFn: ({ signal }) => getPatient(patientId, signal), gcTime: 0, staleTime: 0, refetchInterval: 30_000 });
  useSessionError(query.error);
  if (query.isError) return <CareError error={query.error} retry={() => void query.refetch()} fetching={query.isFetching} />;
  if (query.isPending) return <CareLoading title="Confirmando acesso ao paciente" />;
  return <section className={styles.surface}><h2>{query.data.full_name}</h2><dl className={styles.facts}><dt>Código do paciente</dt><dd><code className={styles.code}>{query.data.id}</code></dd></dl><p className={styles.muted}>Identificação disponibilizada pelo serviço para o acompanhamento individual.</p><Link href="/professional/patients">Voltar para meus pacientes</Link></section>;
}

"use client";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Feedback } from "./states";
import styles from "./care.module.css";

export function ConfirmEndLink({ pending, error, onConfirm, onCancel }: { pending: boolean; error: unknown; onConfirm: () => void; onCancel: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const opener = document.activeElement;
    const element = dialog.current;
    element?.showModal();
    return () => { element?.close(); if (opener instanceof HTMLElement) opener.focus(); };
  }, []);
  return <dialog ref={dialog} className={styles.dialog} aria-labelledby="end-title" aria-describedby="end-description" onCancel={(event) => { if (pending) event.preventDefault(); else onCancel(); }}>
    <h2 id="end-title">Encerrar este vínculo?</h2>
    <p id="end-description">O fisioterapeuta perderá o acesso aos dados autorizados por este vínculo. Para retomar o acompanhamento, será necessário enviar uma nova solicitação.</p>
    <Feedback error={error} />
    <div className={styles.actions}><Button variant="secondary" disabled={pending} onClick={onCancel} autoFocus>Manter vínculo</Button><Button disabled={pending} onClick={onConfirm}>{pending ? "Encerrando…" : "Confirmar encerramento"}</Button></div>
  </dialog>;
}

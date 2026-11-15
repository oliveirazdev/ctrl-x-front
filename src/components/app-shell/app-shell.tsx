import Link from "next/link";
import type { ReactNode } from "react";
import styles from "./app-shell.module.css";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <>
      <a className={styles.skipLink} href="#conteudo">Pular para o conteúdo</a>
      <header className={styles.header}>
        <Link className={styles.brand} href="/" aria-label="Ctrl X — início">Ctrl X</Link>
        <span>Acompanhamento de saúde</span>
      </header>
      <main className={styles.main} id="conteudo" tabIndex={-1}>{children}</main>
      <footer className={styles.footer}>Ctrl X · Ambiente de desenvolvimento</footer>
    </>
  );
}

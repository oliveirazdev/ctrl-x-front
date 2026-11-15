"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import styles from "./app-shell.module.css";
export function AppShell({ children }: { children: ReactNode }) {
 const pathname = usePathname();
 const protectedArea = pathname.startsWith("/patient/") || pathname.startsWith("/professional/");
 return <div className={styles.shell}>
 <a className={styles.skipLink} href="#conteudo">Pular para o conteúdo</a>
 <header className={styles.header}>
 <Link className={styles.brand} href="/" aria-label="Ctrl X · início"><span className={styles.mark} aria-hidden="true">x</span>Ctrl X<span className={styles.brandLabel}>Saúde em continuidade</span></Link>
 <nav aria-label="Navegação principal" className={styles.nav}>
 <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Início</Link>
 {!protectedArea && <Link href="/login" aria-current={pathname === "/login" ? "page" : undefined}>Entrar</Link>}
 {!protectedArea && <Link className={styles.navAction} href="/register" aria-current={pathname === "/register" ? "page" : undefined}>Criar conta</Link>}
 {protectedArea && <Link href={pathname.startsWith("/patient/") ? "/patient/dashboard" : "/professional/dashboard"} aria-current={pathname.endsWith("/dashboard") ? "page" : undefined}>Meu espaço</Link>}
 </nav></header>
 <main className={styles.main} id="conteudo" tabIndex={-1}>{children}</main>
 <footer className={styles.footer}><span>Ctrl X · Acompanhamento de saúde</span><span>Ambiente de desenvolvimento</span></footer>
 </div>;
}

import type { ReactNode } from "react";
import styles from "./ui.module.css";
export function ContentState({ title, children, kind = "empty" }: { title: string; children?: ReactNode; kind?: "loading" | "error" | "empty" }) {
 return <section className={[styles.state, kind === "error" ? styles.error : ""].join(" ")} role={kind === "error" ? "alert" : kind === "loading" ? "status" : undefined} aria-busy={kind === "loading" ? true : undefined}><h2>{title}</h2>{children}</section>;
}

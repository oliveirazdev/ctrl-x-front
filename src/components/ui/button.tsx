import type { ButtonHTMLAttributes } from "react";
import styles from "./ui.module.css";
export function Button({ className = "", variant = "primary", ...props }: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" }) {
 return <button className={[styles.button, variant === "secondary" ? styles.secondary : "", className].join(" ")} {...props} />;
}

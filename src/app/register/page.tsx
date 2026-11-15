import { Suspense } from "react";
import { AuthForm } from "@/features/auth/form";
export default function Register() { return <Suspense fallback={<p>Carregando…</p>}><AuthForm register /></Suspense>; }

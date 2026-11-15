import { Suspense } from "react";
import { AuthForm } from "@/features/auth/form";
export default function Login() { return <Suspense fallback={<p>Carregando…</p>}><AuthForm register={false} /></Suspense>; }

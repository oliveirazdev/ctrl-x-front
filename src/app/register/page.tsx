import { Suspense } from "react";
import { AuthForm } from "@/features/auth/form";
import { ContentState } from "@/components/ui/content-state";
export default function Page() { return <Suspense fallback={<ContentState kind="loading" title="Carregando seu acesso…" />}><AuthForm register={true} /></Suspense>; }

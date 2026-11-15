import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AppShell } from "@/components/app-shell/app-shell";
import { Providers } from "./providers";
import "@/styles/globals.css";

export const metadata: Metadata = {
  title: { default: "Ctrl X | Acompanhamento de saúde", template: "%s | Ctrl X" },
  description: "Acompanhe sua saúde e seu histórico de cuidados com o Ctrl X.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>
        <Providers>
          <AppShell>{children}</AppShell>
        </Providers>
      </body>
    </html>
  );
}

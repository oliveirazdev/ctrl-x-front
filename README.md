# Ctrl X Frontend

Aplicação web responsiva para acompanhamento de saúde de pacientes e profissionais, acessível pelo navegador em desktop, tablet e celular.

O frontend é implantado na Vercel e o backend na Railway.

## Stack

- Next.js App Router, React e TypeScript 6 estrito, compatível com o parser do ESLint.
- CSS Modules e variáveis CSS em `src/styles`.
- React Hook Form, Zod e `@hookform/resolvers` para os próximos formulários.
- TanStack Query para estado remoto, com provider por instância da aplicação.
- ESLint com as configurações oficiais do Next.js.

As versões estão em `package.json` e fixadas pelo `package-lock.json`.

## Desenvolvimento no Windows

Use uma versão atualizada do Node.js 22 e npm, conforme o package.json e o CI.

O processo de release e a configuração do GitHub Actions estão em [CI-CD.md](CI-CD.md).

Antes de iniciar, crie `.env.local` se ainda não existir e configure `NEXT_PUBLIC_API_URL` para a API local (por exemplo, `http://localhost:8000/api/v1`). Preserve o arquivo e os valores locais existentes.

```powershell
npm ci
npm run dev
```

Abra http://localhost:3000.

```powershell
npm run lint
npm run typecheck
npm test
npm run build
npm start
```

## Organização

- `src/app` contém rotas, layout e providers.
- `src/components` contém componentes compartilhados.
- `src/features` agrupa interfaces por domínio.
- `src/services` contém o cliente HTTP com validação da resposta.
- `src/types` contém contratos confirmados com o backend.
- `src/styles` contém tokens e estilos globais.

## Conexão com o backend

Para autenticação, configure `NEXT_PUBLIC_API_URL` com a URL pública da API incluindo `/api/v1` e reinicie ou reconstrua o frontend. Configure `CORS_ORIGINS` do backend com a origem exata do frontend. O cookie SameSite=Lax exige frontend e API no mesmo site em produção. O cadastro não inicia sessão e encaminha para login. O backend não disponibiliza logout ou renovação de sessão; a sessão expira em 15 minutos.

Variáveis `NEXT_PUBLIC_*` são públicas e devem conter somente configuração pública.

A autenticação, os serviços e o indicador de API usam a mesma `NEXT_PUBLIC_API_URL`.
O indicador consulta `GET /health` no host dessa URL, com validação Zod de `{"status":"ok"}`.
A API precisa permitir CORS para a origem do frontend.
A interface apresenta carregamento, disponibilidade, falha e um botão para repetir a consulta.
O endpoint local `/api/health` mede somente a disponibilidade do frontend Next.js e não depende
do backend.

## Escopo desta etapa

A fundação inclui página inicial acessível e responsiva e verificação de conexão.
Autenticação, áreas de paciente/profissional e funcionalidades clínicas ficam para os próximos marcos.
Registros e tokens de pacientes devem seguir os contratos do backend e as regras de privacidade de
`AGENTS.md`.

## Dependências de desenvolvimento

O ESLint 9 atende aos intervalos de compatibilidade dos plugins incluídos pelo Next.js.
O npm informa que essa série está depreciada. A migração depende da compatibilidade desses plugins.
A auditoria inicial apontou oito alertas moderados na cadeia de `minimatch` usada pelo
`typescript-eslint`. `npm audit fix` foi executado. Os alertas restantes exigem acompanhamento
das atualizações dessa cadeia. Execute `npm audit` para consultar a situação atual.

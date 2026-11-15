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

Use Node.js 20.9 ou superior e npm.
Para executar os testes e reproduzir o CI, use Node.js 22.

O processo de release e a configuração do GitHub Actions estão em [CI-CD.md](CI-CD.md).

```powershell
npm ci
Copy-Item .env.example .env.local
npm run dev
```

Abra http://localhost:3000. Em uma instalação já configurada, preserve seu `.env.local`.

```powershell
npm run lint
npm run typecheck
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

Configure `NEXT_PUBLIC_API_BASE_URL` em `.env.local`, inicialmente `http://localhost:8000/api/v1`.
Variáveis `NEXT_PUBLIC_*` são públicas e devem conter somente configuração pública.

A página consulta `/api/health` no Next.js. Essa rota consulta `GET /health` na origem da API,
conforme `ctrl-x-backend/app/main.py`, com timeout de cinco segundos e validação Zod de
`{"status":"ok"}`. O encaminhamento pelo servidor evita dependência de CORS para essa verificação.
A interface apresenta carregamento, disponibilidade, falha e um botão para repetir a consulta.
O backend pode estar desligado durante o desenvolvimento da interface.

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

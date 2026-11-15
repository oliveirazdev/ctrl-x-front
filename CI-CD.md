# CI/CD de produção do Ctrl X

## Estado verificado em 15/11/2026

O remoto `origin` é `https://github.com/rafascampelo/crlt-x-front.git`. O package.json está na raiz do repositório Git. A default branch continua `main`.

A consulta `git ls-remote origin refs/heads/prod refs/heads/develop` confirmou os hashes das referências locais. `prod` contém package.json, package-lock.json, next.config.ts e src, no commit `c5c6ac649c2478b38729bddd51d0a5549195b3c8`. `develop` está em `ae49e2090f4d931d5e0903b54fbd29246297dd77`. Ambos já contêm Next.js. Reconfirme antes da primeira promoção.

A configuração externa da Vercel, o ORG ID, o domínio de produção e a URL HTTPS da Railway dependem de acesso administrativo. Não foram confirmados nesta implementação. A configuração local não contém `.vercel/project.json`. `.env.local` aponta a API para localhost. A exclusão de `.env.example` já existia no working tree e foi preservada.

## Workflows

- `.github/workflows/frontend.yml` mantém o job `CI` com Node 22, `npm ci`, ESLint, typecheck, testes existentes e build Next.js. Executa em PRs para develop/prod, pushes em develop e como workflow reutilizável. PR para develop exige origem feature/*. PR para prod exige develop no mesmo repositório. PRs executam sem secrets de produção.
- `.github/workflows/deploy-production.yml` executa exclusivamente em push para prod. Primeiro chama o CI sobre o mesmo commit, depois publica no environment production. A publicação usa Vercel CLI fixada em `50.0.0`, `vercel pull --yes --environment=production`, `vercel build --prod` e `vercel deploy --prebuilt --prod`. O Project ID fixo é `prj_vJdkGC4SQreqnD8LhiDl7rnqtPC9`.
- A concorrência `frontend-production` serializa as execuções, com `cancel-in-progress: false` para preservar publicações em andamento. GitHub pode substituir uma execução pendente por outra mais recente no mesmo grupo.
- Permissões do GITHUB_TOKEN limitadas a `contents: read`. Secrets ausentes encerram a publicação com mensagem explícita. O vínculo retornado pela Vercel é comparado ao projeto/time configurados. Arquivos de ambiente e `.vercel/output` permanecem no runner, sem upload de artifacts.
- Após publicação, os checks HTTP verificam `/` e `/api/health` na URL canônica. Falha posterior à publicação deixa o job vermelho e exige avaliação de rollback. Esses checks cobrem disponibilidade e conexão health com a API. Complete os testes funcionais abaixo.

O workflow anterior foi avaliado e seu job de produção foi transferido para o arquivo dedicado, preservando os gates, a espera do deployment e os health checks.

## GitHub e secrets

Em Settings → Environments, crie `production` e permita deployments somente da branch `prod`. Cadastre os seguintes environment secrets.

| Secret | Origem |
| --- | --- |
| `VERCEL_TOKEN` | Token da conta autorizada a publicar no time/projeto Vercel. Use o menor escopo e validade disponíveis. |
| `VERCEL_ORG_ID` | ID real do proprietário/time do projeto. Confira Team Settings → General, ou o campo `orgId` de `.vercel/project.json` após vincular ao projeto correto com a CLI autenticada. |

O Project ID já está fixado no workflow. O antigo secret `VERCEL_PROJECT_ID` deixa de ser necessário. A versão da CLI agora está no código. A antiga variable `VERCEL_CLI_VERSION` deixa de ser necessária.

Cadastre a environment variable GitHub `PRODUCTION_URL` com a origem canônica HTTPS do frontend, sem caminho, usuário, query ou fragmento. Exemplo de formato apenas, `https://dominio-do-frontend`. Use o domínio real.

Para obter o ORG ID por CLI, em um checkout local autorizado execute `vercel link --project prj_vJdkGC4SQreqnD8LhiDl7rnqtPC9`, selecione o time real e confira `projectId` e `orgId` em `.vercel/project.json`. Esse passo requer autenticação e cria o vínculo local. Confira o ID antes de cadastrar o secret. Preserve `.vercel/` ignorado pelo Git. Nunca versionar ou imprimir o token.

## Configuração manual da Vercel

Abra o projeto de ID `prj_vJdkGC4SQreqnD8LhiDl7rnqtPC9` e confira em Settings → Build and Deployment.

| Configuração | Valor |
| --- | --- |
| Framework Preset | Next.js |
| Root Directory | Raiz do repositório, exibida como `./` ou vazia no dashboard |
| Node.js | 22.x |
| Install Command | `npm ci`, sem aspas literais adicionais |
| Build Command | `npm run build` |
| Output Directory | Padrão do preset Next.js, com override desativado |
| Production Branch | prod |

`vercel.json` fixa o preset, instalação e build. O Next.js mantém seu output padrão. A CLI gera `.vercel/output` para publicação prebuilt. Confira também overrides do ambiente Production no dashboard.

### Impedir deploys Git independentes

`vercel.json` já contém `git.deploymentEnabled: false`. Essa opção desabilita deployments pela integração Git para todas as branches que contêm o arquivo. Preserve-a em feature/*, develop e prod. A CLI utilizada pelo Actions continua sendo o caminho de publicação.

Antes de promover os workflows, revise Settings → Git no dashboard, confirme o repositório e a production branch, e confira a presença dessa configuração nas branches remotas. Em Settings → Git → Ignored Build Step, como defesa adicional para builds iniciados via Git, selecione Custom e informe `exit 0`, que determina ignorar o build Git. Essa opção pode registrar uma tentativa cancelada. A restrição principal está no `git.deploymentEnabled: false`. O build local pela CLI executa explicitamente `npm run build`.

Revise Deploy Hooks, outras Actions e integrações que possam iniciar publicações. Desative os mecanismos independentes mediante autorização do responsável. A configuração por arquivo depende da presença dele na branch recebida, portanto confirme a cobertura antes de futuros pushes. A implementação não desconectou o repositório nem alterou configurações externas.

Referências oficiais de [controle de deploys Git](https://vercel.com/docs/project-configuration/git-configuration), [configuração de build e Ignored Build Step](https://vercel.com/docs/project-configuration/project-settings) e [Actions com Vercel CLI](https://vercel.com/kb/guide/how-can-i-use-github-actions-with-vercel).

## API Railway e ambiente Production

Obtenha em Railway → serviço FastAPI → Settings → Networking o domínio público HTTPS real. Confirme que o backend expõe `/api/v1` e `/health`. Em Vercel → Settings → Environment Variables, no ambiente Production, configure os dois nomes com o mesmo valor real terminado em `/api/v1`.

- `NEXT_PUBLIC_API_URL` é consumida pela autenticação.
- `NEXT_PUBLIC_API_BASE_URL` é consumida pelo health check existente.

O workflow valida HTTPS, o sufixo `/api/v1`, ausência de credenciais na URL e igualdade das duas variáveis, antes do build. A validação de formato não comprova a identidade nem a disponibilidade da API. O responsável deve confirmar o domínio na Railway. Domínios personalizados são aceitos.

As variáveis são baixadas por `vercel pull` no ambiente Production. Variáveis NEXT_PUBLIC são embutidas no JavaScript pelo build. Atualizações exigem novo build/deploy. Credenciais do banco, chaves do backend e tokens Vercel ficam nos respectivos ambientes privados. Configure CORS do backend para a origem canônica do frontend e valide o cookie de autenticação no navegador. O contrato atual usa SameSite=Lax e exige frontend/API no mesmo site para autenticação entre origens. Domínios padrão vercel.app e railway.app precisam de uma estratégia de domínio/cookie compatível confirmada com o backend antes do lançamento.

## Proteção das branches e primeira promoção

Em GitHub → Settings → Rules → Rulesets, proteja develop e prod. Exija PR, aprovação conforme a equipe, resolução de conversas, status check `CI` do workflow Frontend e atualização da branch antes do merge. Bloqueie force push e exclusões e aplique a proteção aos administradores, com bypass restrito conforme a política do projeto. Selecione o check real emitido por um PR após publicar a configuração. Não habilite merge queue sem adicionar suporte ao evento merge_group.

A regra de PR é essencial para que um push em prod corresponda a um merge aprovado. O evento push sozinho também seria disparado por um push direto autorizado no servidor. O gate CI verifica a origem dos PRs. As proteções precisam ser ativadas no GitHub.

1. Revise o diff desta feature junto às alterações de interface em andamento. Após autorização, publique a feature e abra PR feature/* → develop.
2. Aguarde `CI` aprovado e faça o merge autorizado.
3. Reconfirme prod com `git fetch origin` e `git show origin/prod:package.json`. Se o Next.js estiver ausente, promova a aplicação completa via PR antes de tentar publicar.
4. Configure secrets, URL canônica, API Production, projeto Vercel e bloqueios de deploys Git antes do merge de release.
5. Abra PR develop → prod, confira Next.js, lockfile e os dois workflows no diff, aguarde CI e aprovação. O merge autorizado dispara a validação completa e a publicação.
6. Verifique o SHA do deployment e o resultado dos smoke tests. Registre evidências no PR de release.

## Smoke tests pós-deploy

Use contas de teste autorizadas e dados sintéticos. Registre domínio, SHA, horário e resultado.

- [ ] Actions conclui CI, build, publicação, espera do deployment e health checks.
- [ ] O deployment Vercel corresponde ao SHA do merge em prod, com origem CLI/Actions. Confira ausência de outro deployment Git para o mesmo SHA.
- [ ] `/` abre em desktop e mobile. CSS, JavaScript, imagens/fontes e assets `/_next/static/*` retornam corretamente, sem erros de hidratação no console.
- [ ] `/login` valida campos e autentica com a API real. Credenciais inválidas exibem erro adequado.
- [ ] `/register` valida campos, cadastra usuário sintético e encaminha ao login conforme o contrato atual.
- [ ] `/patient/dashboard` e `/professional/dashboard` funcionam com as respectivas contas. Acesso sem sessão e acesso de outro perfil seguem as regras implementadas. Confira refresh e navegação direta.
- [ ] Network do navegador usa o domínio Railway confirmado e `/api/v1`, sem mixed content ou falhas CORS. Cookies de sessão são aceitos/enviados no contexto real do navegador.
- [ ] `/api/health` retorna HTTP 200 e `status` igual a `ok`, consultando o backend real.
- [ ] Falhas de rede/API apresentam os estados de erro e recuperação esperados.

Os smoke tests de produção dependem do deploy autorizado. A implementação dos workflows não demonstra que a aplicação já funciona em produção.

## Rollback

Se os checks falharem após publicar, avalie o impacto e obtenha autorização operacional. No painel Vercel identifique pelo SHA o deployment anterior saudável e execute Instant Rollback. Repita os smoke tests. Corrija ou reverta o código por feature/* → develop → prod com os mesmos gates. Preserve compatibilidade com a API durante a janela de rollback. A reversão não é automática no workflow.

## Validações locais desta implementação

Executadas com Node `22.23.5` temporário, pois a instalação padrão local é Node 20.

- `npm ci` concluiu com o lockfile existente. O npm reportou oito vulnerabilidades moderadas e depreciação do ESLint 9.39.5.
- `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passaram. Os seis testes existentes passaram. O runner de testes emite avisos sobre transformação experimental de tipos e inferência de ES modules.
- YAML dos dois workflows e JSON da Vercel foram analisados. O gatilho exclusivo de produção e sua dependência do CI foram conferidos. Nove cenários sintéticos do guard de projeto/time e URL da API passaram.
- Servidor local do build de produção, com `next start` em 127.0.0.1:3107, respondeu HTTP 200 em `/`, `/login`, `/register`, `/patient/dashboard` e `/professional/dashboard`. Dezessete assets Next.js retornaram HTTP 200. Esses checks HTTP verificam entrega das páginas e assets.
- `/api/health` retornou HTTP 503 com a configuração local, portanto a conexão integrada com a API permanece pendente. Autenticação/cadastro reais, autorização dos dashboards e comportamento no navegador em produção dependem do checklist de smoke tests.
- `git diff --check` passou. O lockfile e o código da interface permaneceram sem alterações desta tarefa.

Os comandos Vercel autenticados e os workflows no GitHub aguardam a configuração externa e a publicação autorizada dos arquivos.
# CI/CD de produção do Ctrl X

## Estado verificado em 15/11/2026

O remoto `origin` é `https://github.com/rafascampelo/crlt-x-front.git`. O package.json está na raiz do repositório Git. A default branch continua `main`.

A auditoria com `git fetch origin` confirmou `prod` no commit `6e14d9b29bdbdf97f267a5cadcbc10522e29d1b9` e `develop` em `230a69a`. `prod` contém package.json, package-lock.json, next.config.ts, src, testes, os dois workflows e vercel.json com preset Next.js, instalação `npm ci` e deploy Git desativado.

A configuração externa da Vercel, o ORG ID, o domínio de produção e a URL HTTPS da Railway dependem de acesso administrativo. Não foram confirmados nesta implementação. A configuração local não contém `.vercel/project.json`. `.env.local` aponta a API para localhost. A exclusão de `.env.example` já existia no working tree e foi preservada.

## Diagnóstico da execução recente

Foram consultados os metadados, steps e annotations públicos do GitHub Actions em 15/11/2026. A execução mais recente de `prod` foi iniciada às 17h24 de Brasília, no SHA `6e14d9b`. O job de CI concluiu instalação, lint, typecheck, testes e build. O job Publish production falhou em Validate required configuration, com `Missing required GitHub secret VERCEL_TOKEN in environment production`. Todos os comandos Vercel foram ignorados. A execução anterior, às 16h46, falhou no mesmo ponto. [Execução mais recente](https://github.com/rafascampelo/crlt-x-front/actions/runs/43757907064), [job de publicação](https://github.com/rafascampelo/crlt-x-front/actions/runs/43757907064/job/132946155051) e [execução anterior](https://github.com/rafascampelo/crlt-x-front/actions/runs/43754250431).

A ausência de token disponível para o job é o bloqueio confirmado na execução recente. Isso não permite concluir se o token nunca foi cadastrado, foi cadastrado como variable, está em outro environment ou tem acesso restrito. A consulta autenticada da configuração de secrets não estava disponível. O download dos logs completos via API retornou HTTP 403. As annotations e o resultado dos steps estavam disponíveis publicamente.

O erro antigo `sh: line 1: npm install: command not found`, associado ao comando completo entre aspas literais, é compatível com o shell tentando executar um nome de programa que contém espaço. Essa é a explicação técnica da mensagem fornecida. A origem daquele valor no dashboard ou no código do deployment antigo ainda precisa ser confirmada com o respectivo SHA e log. O código atual e o vercel.json de prod definem `npm ci`, sem aspas literais. O `installCommand` do arquivo tem precedência sobre o dashboard quando esse arquivo é carregado a partir da raiz correta. [Referência de installCommand](https://vercel.com/docs/project-configuration/vercel-json#installcommand).

No último SHA de prod, os checks públicos consultados pertencem somente ao GitHub Actions. A amostra dos cinco deployments GitHub mais recentes retornou três registros, correspondentes às três execuções da esteira. Essa evidência não mostrou deploy Vercel nativo duplicado. A listagem de deployments no dashboard Vercel e seus logs não estavam acessíveis para confirmar exclusividade em todo o histórico. `git.deploymentEnabled: false` permanece versionado em prod.

Os avisos atuais do runner indicaram depreciação de actions/checkout@v4 e actions/setup-node@v4. Os workflows foram atualizados para as versões oficiais exatas `checkout@v7.0.1` e `setup-node@v7.1.0`, que usam runtime Node 24 internamente e suportam os runners hospedados atuais. O aplicativo continua sendo instalado e testado com Node 22. O package.json e a entrada raiz do lockfile agora restringem Node a `22.x`, alinhando CI, testes e seleção do runtime Vercel.

O guard após `vercel pull` confere projeto/time, raiz, preset Next.js, comandos do repositório e bloqueio de Git deployments, sem imprimir valores de ambiente. Se o dashboard tiver Install Command diferente, ele emite um aviso para alinhamento e mantém a precedência documentada do vercel.json.

### Ajustes externos e próxima validação

1. No repositório `rafascampelo/crlt-x-front`, abra Settings → Environments → production → Environment secrets. Cadastre `VERCEL_TOKEN` (como secret, não variable) com um token da Vercel que tenha acesso ao proprietário/time do projeto. O job de publicação declara `environment: production` e injeta esse secret somente nos passos `vercel pull`, `vercel build` e `vercel deploy/inspect`. Confira também `VERCEL_ORG_ID`. Secrets de repositório também podem ser resolvidos por `secrets`, desde que estejam disponíveis para essa execução. Variáveis em Variables, `.env.local` ou no ambiente de outra aplicação não preenchem esse contexto.
2. Confirme `PRODUCTION_URL` em Environment variables do GitHub. O Project ID já é fixado no workflow em `prj_vJdkGC4SQreqnD8LhiDl7rnqtPC9`. A igualdade com o projeto e o ORG ID reais só poderá ser conferida após um `vercel pull` autenticado.
3. Na Vercel, no projeto com esse ID, confira os overrides Production. Selecione Next.js, raiz do repositório, Node 22.x, Install Command `npm ci`, Build Command `npm run build` e Output Directory padrão. Remova aspas literais de comandos no dashboard. As aspas de delimitação de strings JSON no vercel.json são necessárias e não fazem parte do comando.
4. Confira que o deployment antigo usou o repositório, SHA e Root Directory corretos. Se o log mostrar clone, instalação e build remotos completos, investigue sua origem. A etapa `vercel deploy --prebuilt --prod` deve publicar o artefato já construído no runner.
5. Confira os dois nomes de URL da API no ambiente Production da Vercel, com o mesmo backend HTTPS real e `/api/v1`. Preserve o bloqueio `git.deploymentEnabled: false` e revise Deploy Hooks/integrações externas que possam publicar. Qualquer alteração externa depende de autorização do responsável.
6. Após configurar o token, uma reexecução do job atual pode validar as credenciais usando o código desse SHA. Para validar as correções desta auditoria, promova-as pelo fluxo feature/* → develop → prod, com as aprovações necessárias. Uma reexecução de um SHA antigo conserva o workflow antigo.
7. Na próxima execução autorizada, confira sucesso do CI, validação de secrets, `vercel pull --yes --environment=production`, validação do destino/configuração, `vercel build --prod`, existência de `.vercel/output/config.json`, `vercel deploy --prebuilt --prod`, espera do deployment e health checks. Registre o SHA e a URL publicados no resumo do Actions.
8. Compare o SHA no dashboard Vercel, confirme a origem CLI/Actions e procure outro deployment para o mesmo commit. Execute o checklist funcional de login, cadastro, perfis, dashboards, assets e API abaixo. O término do build não demonstra autenticação ou conectividade de produção.

O token permanece fora de arquivos e de variáveis NEXT_PUBLIC. Não foi feita publicação nem alterada configuração externa durante a auditoria.

## Workflows

- `.github/workflows/frontend.yml` mantém o job `CI` com Node 22, `npm ci`, ESLint, typecheck, testes existentes e build Next.js. Executa em PRs para develop/prod, pushes em develop e como workflow reutilizável. PR para develop exige origem feature/*. PR para prod exige develop no mesmo repositório. PRs executam sem secrets de produção.
- `.github/workflows/deploy-production.yml` executa exclusivamente em push para prod. Primeiro chama o CI sobre o mesmo commit, depois publica no environment production. A publicação usa Vercel CLI fixada em `50.0.0`, `vercel pull --yes --environment=production`, `vercel build --prod` e `vercel deploy --prebuilt --prod`. O Project ID fixo é `prj_vJdkGC4SQreqnD8LhiDl7rnqtPC9`.
- A concorrência `frontend-production` serializa as execuções, com `cancel-in-progress: false` para preservar publicações em andamento. GitHub pode substituir uma execução pendente por outra mais recente no mesmo grupo.
- Permissões do GITHUB_TOKEN limitadas a `contents: read`. Secrets ausentes encerram a publicação com mensagem explícita. O vínculo retornado pela Vercel é comparado ao projeto/time configurados. Arquivos de ambiente e `.vercel/output` permanecem no runner, sem upload de artifacts.
- Após publicação, os checks HTTP verificam `/` e `/api/health` na URL canônica. Falha posterior à publicação deixa o job vermelho e exige avaliação de rollback. Esses checks cobrem disponibilidade e conexão health com a API. Complete os testes funcionais abaixo.

O workflow anterior foi avaliado e seu job de produção foi transferido para o arquivo dedicado, preservando os gates, a espera do deployment e os health checks.

## GitHub e secrets

Em Settings → Environments, crie `production` e permita deployments somente da branch `prod`. Cadastre os seguintes environment secrets.

| Nome | Finalidade | Local | Obrigatório | Formato seguro |
| --- | --- | --- | --- | --- |
| `VERCEL_TOKEN` | Autoriza Vercel CLI | Environment `production` → Environment secrets | Sim | Secret da conta/time com acesso ao projeto |
| `VERCEL_ORG_ID` | Confirma o time vinculado | Environment `production` → Environment secrets | Sim | ID de Team Settings → General / `.vercel/project.json` |
| `PRODUCTION_URL` | Healthcheck do frontend | Environment `production` → Environment variables | Sim | `https://dominio-real` ou com `/` final |
| `NEXT_PUBLIC_API_URL` | Autenticação e chamadas da API | Vercel → Project Settings → Environment Variables → Production | Sim para API | Origem Railway confirmada + `/api/v1` |
| `NEXT_PUBLIC_API_BASE_URL` | Indicador de saúde do backend | Mesmo ambiente Production da Vercel | Sim para indicador | Mesmo valor de `NEXT_PUBLIC_API_URL` |

O Project ID já está fixado no workflow. O antigo secret `VERCEL_PROJECT_ID` deixa de ser necessário. A versão da CLI agora está no código. A antiga variable `VERCEL_CLI_VERSION` deixa de ser necessária.

Cadastre `PRODUCTION_URL` como environment variable GitHub com a origem HTTPS canônica do deployment Production Vercel, sem caminho, usuário, query ou fragmento. `https://dominio-real` e a mesma origem com `/` final são aceitos. Para identificar o domínio, abra o deployment Production atual no dashboard Vercel e copie somente a origem.

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
- `NEXT_PUBLIC_API_BASE_URL` é consumida pelo indicador de saúde do backend no navegador.

O workflow valida HTTPS, o sufixo `/api/v1`, ausência de credenciais, caminho extra, query ou fragmento, ausência de localhost e igualdade de origem/caminho antes do build. A validação de formato não comprova a identidade nem a disponibilidade da API. O responsável deve confirmar o domínio na Railway. Se Railway ainda não tiver domínio público, não invente nem use placeholder: configure os dois valores após publicar o serviço. Rode `npm run validate:production-config` com `PRODUCTION_URL` definido para testar a origem localmente. Para repetir o deploy, abra Actions → Deploy production → Run workflow na branch prod; o gatilho de produção também continua após merge/push em prod.

As variáveis são baixadas por `vercel pull` no ambiente Production. Variáveis NEXT_PUBLIC são embutidas no JavaScript pelo build. Atualizações exigem novo build/deploy. Credenciais do banco, chaves do backend e tokens Vercel ficam nos respectivos ambientes privados. Configure CORS do backend para a origem canônica do frontend e valide o cookie de autenticação no navegador. O indicador de API no cliente também depende de CORS. `/api/health` verifica somente a resposta local do Next.js e não falha se Railway estiver indisponível. O contrato atual usa SameSite=Lax e exige frontend/API no mesmo site para autenticação entre origens. Domínios padrão vercel.app e railway.app precisam de uma estratégia de domínio/cookie compatível confirmada com o backend antes do lançamento.

## Proteção das branches e primeira promoção

### Automação de PRs e auto-merge

O workflow `Enable pull request auto-merge` usa `pull_request_target` somente para ler metadados do PR e solicitar o auto-merge nativo do GitHub com squash. Ele não faz checkout nem executa código do PR. Só habilita auto-merge para PRs não draft do mesmo repositório: `feature/*` → `develop` e `develop` → `prod`. O GitHub continua responsável por aguardar CI, atualidade da branch e aprovação. Não há aprovação automatizada. Se auto-merge estiver desativado no repositório, o comando falha e o PR continua aberto.

O workflow `Create production promotion PR` roda após push em develop ou manualmente. Ele reutiliza o PR aberto `develop` → `prod` e só cria um novo quando a comparação indica commits à frente. `GITHUB_TOKEN` recebe somente `contents: read` e `pull-requests: write`; não pode aprovar nem contornar regras. Ative **Allow auto-merge** nas configurações gerais do repositório. Se políticas da organização impedirem o `GITHUB_TOKEN` de criar PRs, configure uma GitHub App dedicada com `Contents: read` e `Pull requests: write`, restrita a este repositório, e troque o token do workflow por um token de instalação de curta duração. Não use PAT pessoal ou bypass.

Configure Rulesets separados para `develop` e `prod`, ambos sem bypass actors, com Require a pull request, Require status checks, Require branches to be up to date, Block force pushes e Block deletions. Use squash como único método de merge, se a política permitir. O status check obrigatório é `CI` (job `CI` do workflow Frontend); confirme o nome exibido pelo GitHub após um PR de teste. Não habilite merge queue sem adicionar evento e validação `merge_group` ao CI.

Em `develop`, exija o check `CI` e não exija aprovação humana. Em `prod`, exija `CI` e pelo menos uma aprovação de pessoa diferente do autor; habilite dismissal de aprovação após novos commits e CODEOWNERS se apropriado. Marque “Require approval of the most recent reviewable push” para impedir que o autor aprove a própria última alteração. A branch deve permanecer sem bypass inclusive para administradores e Actions. Confira se o plano GitHub da conta/organização permite Rulesets e as regras requeridas; isso não pôde ser verificado nesta sessão, pois `gh` não está instalado e não há acesso administrativo confirmado.

Teste com PR sintético: confirme que `feature/*` recebe CI e auto-merge pendente, que CI falhando mantém o PR aberto, e que a aprovação humana requerida destrava o auto-merge em `prod`. Tente push direto em `develop` e `prod` com uma branch de teste/usuário sem bypass; o servidor deve rejeitar. Depois confirme que apenas o evento `push` resultante do merge em `prod` dispara `Deploy production`. Os workflows mantêm esse gatilho e o deploy usa `GITHUB_TOKEN` sem permissões de escrita em conteúdo, evitando eventos de deploy recursivos.

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

## Validações locais da auditoria

Executadas com Node `22.23.5` temporário, pois a instalação padrão local é Node 20.

- `npm run lint`, `npm run typecheck`, `npm test` e `npm run build` passaram. Os 33 testes existentes passaram. O runner de testes emite os avisos já existentes sobre transformação experimental de tipos e inferência de ES modules.
- YAML dos dois workflows e JSON da Vercel foram analisados. O gatilho exclusivo em push de prod, a dependência do CI e a instalação com npm ci foram conferidos.
- Quatorze cenários sintéticos do guard de configuração passaram, incluindo alvo/time incorretos, raiz incorreta, comandos com aspas literais, framework incorreto, Git deployment habilitado, URL API inválida e divergência do dashboard com precedência correta do arquivo versionado.
- Dependências, devDependencies e engines do package.json foram comparadas com a entrada raiz do package-lock.json. A alteração do lockfile restringe apenas o engine raiz a Node 22.x. As versões de dependências foram preservadas. A instalação `npm ci` já consta como aprovada no CI remoto mais recente.
- `git diff --check` passou. As mudanças desta auditoria abrangem os dois workflows, package.json, package-lock.json, README.md e este documento.

Os novos workflows e as novas versões das Actions ainda precisam executar no runner GitHub após promoção autorizada. Os comandos Vercel autenticados, as configurações efetivas do dashboard, a validade do token e o ORG ID real aguardam acesso autorizado. Os testes locais não comprovam o funcionamento do deployment de produção.

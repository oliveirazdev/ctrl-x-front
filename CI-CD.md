# CI/CD do frontend

O workflow `.github/workflows/frontend.yml` executa CI em PRs destinados a `develop` ou `prod` e em pushes nessas branches. Somente push em `prod`, com CI aprovado, habilita publicação. Cada job tem timeout, permissões de leitura e execução serializada. Nenhum deploy foi executado durante a implementação.

## Bloquear push direto em `prod`

No GitHub, abra **Settings → Rules → Rulesets → New branch ruleset**. Nomeie `protect-prod`, selecione **Active**, direcione a branch `prod` e não conceda bypass. Marque **Restrict updates**, **Require a pull request before merging**, **Require status checks to pass** com o check `CI`, **Block force pushes** e **Restrict deletions**. Se a equipe exigir revisão, marque também aprovação obrigatória. Assim pushes diretos são rejeitados no servidor, inclusive para administradores sem bypass.

Crie regra equivalente para `develop`, sem permitir bypass. O arquivo versionado não consegue impor proteção remota. A proteção só vale depois de ativar essas regras nas configurações GitHub com permissão administrativa. Confirme que o workflow publicou o check `CI` para seleção antes de torná-lo obrigatório.

Para releases, aceite PR para `prod` somente com `develop` como origem e CI aprovado. GitHub não restringe nativamente a branch de origem com a regra básica de proteção. Revise a origem do PR durante aprovação ou use uma regra de repositório/automação adicional se for necessário impor isso tecnicamente. Desative qualquer mecanismo que contorne a proteção.

## Configuração

Crie o GitHub Environment `production`, restrinja as branches autorizadas a `prod` e configure revisores obrigatórios conforme a equipe. Cadastre os secrets `VERCEL_TOKEN`, `VERCEL_ORG_ID` e `VERCEL_PROJECT_ID` nesse environment. O token precisa publicar apenas no projeto/time correspondente.

Configure as variables `PRODUCTION_URL` com a origem HTTPS pública canônica, sem caminho, e `VERCEL_CLI_VERSION` com uma versão exata da CLI aprovada pela equipe. O workflow falha se essas configurações estiverem ausentes. Configure Node.js 22 também no projeto Vercel.

Na Vercel, configure `NEXT_PUBLIC_API_BASE_URL` no ambiente Production apontando para a API compatível. Variáveis públicas são embutidas no build. Nunca cadastre credenciais de banco ou tokens privados em variáveis públicas. Os testes usam fetch simulado e nenhum banco de dados.

`vercel.json` desativa os deploys Git nativos. Verifique que essa configuração existe nas duas branches e remova Deploy Hooks ou outras automações que publiquem independentemente do workflow.

## Validação e artefato

O CI executa `npm ci`, ESLint, TypeScript, testes reais do cliente HTTP e build Next.js, sem secrets. O job production repete instalação e verificações, baixa a configuração Production e executa `vercel build --prod`. A CLI utiliza o buildCommand padrão `npm run build` do projeto. Preserve esse comando nas configurações Vercel.

O mesmo diretório `.vercel/output` validado no runner é publicado com `vercel deploy --prebuilt --prod`. Ele permanece no mesmo job para evitar transportar configuração de produção entre jobs. Não há reconstrução remota. Falhas da CLI, espera do deployment e health checks encerram o job com erro. Os logs ficam no Actions e o URL e commit publicados no resumo. Nunca publique `.vercel` ou arquivos de ambiente como artifacts públicos.

Após a publicação, a pipeline verifica `/` e `/api/health` na URL canônica, incluindo `status: ok`. O health depende da API real. Uma falha após publicação deixa o job vermelho e exige avaliar rollback, pois a versão já pode estar atendendo tráfego. Deployment Protection deve permitir esses health checks públicos.

## Proteção e release

Proteja `develop` e `prod` com rulesets ativos no GitHub. Aplique as regras a administradores também e não configure bypass. Exija PR, status obrigatório `CI`, resolução de conversas e bloqueie force push e exclusão. Em `prod`, restrinja atualizações e permita somente o caminho por PR de `develop`. Revise alterações de workflows antes do merge. A configuração exige permissão de administração no repositório e não é ativada por um arquivo versionado.

Desenvolva por PR para `develop`. Para release, abra PR de `develop` para `prod`, revise configuração pública e compatibilidade da API e aguarde CI. O merge gera push em `prod`, novo CI e publicação após aprovação do environment. Execuções de produção ficam serializadas e não são canceladas durante publicação. Com o ruleset ativo, pushes diretos para `prod` são recusados no GitHub. O job de produção continua condicionado a push em `prod`, que ocorre após o merge autorizado do PR.

Publique mudanças aditivas da API antes do frontend que as utiliza. Preserve campos e endpoints consumidos pela versão anterior durante a janela de rollback. Registre no PR a versão/commit da API compatível e valide o fluxo integrado em ambiente de teste antes da aprovação. Os testes atuais verificam o contrato confirmado de health e o cliente HTTP. Amplie a cobertura conforme novos contratos forem implementados.

## Rollback

No painel Vercel, identifique o deployment anteriormente saudável pelo commit e use Instant Rollback. Verifique `/` e `/api/health` e registre o incidente. Em seguida reverta o commit causador por PR para `prod`, seguindo CI e aprovação, e sincronize a correção em `develop`. Uma reversão do frontend exige uma API ainda compatível com a versão restaurada. Os logs dos steps Actions e os logs do deployment no painel Vercel permitem investigar falhas de build, publicação e runtime.

Referências oficiais — [build local](https://vercel.com/docs/cli/build), [deploy prebuilt](https://vercel.com/docs/cli/deploy) e [controle de deploys Git](https://vercel.com/docs/project-configuration/git-configuration).

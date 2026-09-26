# Decisoes do projeto

Memoria do harness. Registra decisao tomada, data e motivo — para que ninguem
reabra o assunto sem caso novo, e para que a poda futura nao seja adivinhacao.

## API simulada no proprio repositorio (MSW)

Data: 2026-09. O painel precisa rodar sem backend para servir de material do
livro: o leitor clona, instala e abre. Os handlers ficam em `src/mocks/` e
valem tanto no navegador quanto nos testes, o que evita ter duas versoes da
mesma regra. Trocar por backend real exige refazer so a camada `services/`.

## SQLite (sql.js) como banco, atras do MSW

Data: 2026-09. Substituiu o array em memoria. E SQLite de verdade, compilado
para WebAssembly: schema com constraints, chaves estrangeiras e SQL nos
handlers. O arquivo do banco e persistido em IndexedDB no navegador; nos
testes, cada caso comeca com banco novo em memoria.

Por que valeu a troca: o schema passou a carregar parte das regras. A DM-01 e
a DM-02 continuam sendo verificadas em codigo, mas status invalido e vistoria
orfa de cliente agora sao barrados pelo proprio banco — e ha teste provando
os dois.

Armadilha registrada: o sql.js publica duas variantes do binario. No Node o
pacote resolve para sql-wasm.js (pede `sql-wasm.wasm`); no navegador, a
condicao "browser" resolve para sql-wasm-browser.js (pede
`sql-wasm-browser.wasm`). Copiar o arquivo errado passa no `npm run dev` e
quebra so no build de producao, com o servidor devolvendo HTML no lugar do
binario.

## Deploy no GitHub Pages a cada push na main

Data: 2026-09. O painel publicado serve de demonstracao do livro. O workflow
roda `npm run check` e `npm test` antes de publicar: o mesmo criterio de
pronto do harness vale para o deploy. Como o site fica num subdiretorio
(/vistoria-web/), tres coisas dependem do base: o build do Vite, o basename do
roteador e a URL do service worker do MSW. O 404.html e copia do index.html,
para que rota profunda nao caia em pagina de erro do Pages.

## Datas em UTC como string ISO, nunca Date

Data: 2026-09. Fusos diferentes em campo causavam divergencia de um dia.
Ver AR-04 na Constitution.

## Regra de dominio validada tambem no cliente

Data: 2026-09. A DM-02 e checada na API simulada e tambem em
`services/vistorias.ts`. Nao e duplicacao por descuido: a versao do cliente
existe para explicar ao usuario *por que* a finalizacao esta bloqueada, sem
depender de ida ao servidor. A fonte da verdade continua sendo a API.

## Paginacao ainda em aberto

Offset e simples mas quebra com insercao concorrente. Cursor e correto mas
mais trabalhoso. Decidir antes de a base de vistorias passar de alguns
milhares.

## Command novo-componente e skill formulario-de-feature criados

Data: 2026-09. Os dois vieram de dor real, nao de antecipacao.

O command nasceu quando o botao primario apareceu identico em tres paginas
(clientes, modelos, vistorias) — `grep` confirmou 3 ocorrencias antes de
qualquer coisa ser escrita. Usado para criar o componente `Botao`, que
substituiu as 3 ocorrencias por 0.

Ao usar o command, um bug real escapou do `npm run check`: o primeiro
`Botao` deixava o chamador sobrescrever padding via `className`, e CSS nao
garante que a classe do `className` vença a classe base — o botao de
cancelar saiu do tamanho errado com tudo verde. Corrigido trocando a
sobrescrita implicita por uma prop `tamanho` explicita. Ver
`src/components/Botao/Botao.tsx`.

A skill nasceu porque o mesmo procedimento — hook de query + mutation,
estado local do form, invalidar cache, resetar formulario, mostrar erro —
tinha sido escrito manualmente tres vezes (clientes, modelos, vistorias)
antes de qualquer skill existir. Ver `.claude/skills/formulario-de-feature/`.

## Mutation de cancelar compartilhada entre linhas da lista

Data: 2026-09. `VistoriasPage` chama `useCancelarVistoria()` uma vez, no topo
do componente, e cada card usa a mesma instancia no `onClick`. Isso e
correto para disparar a acao, mas `isPending`/`isError`/`variables` da
mutation sao do HOOK, nao da linha — sem checar `cancelar.variables`, dois
sintomas reais apareciam: duplo clique disparava duas chamadas DELETE (a
segunda voltava 404, porque o registro ja tinha sumido) e o erro aparecia
embaixo do formulario de "Agendar", sem relacao com a linha cancelada.

Reproduzido com Playwright antes de mexer no codigo (duplo clique real:
204 depois 404). Corrigido comparando `cancelar.variables === vistoria.id`
para decidir qual linha mostra "Cancelando…" e qual linha mostra o erro.
Dois testes em `VistoriasPage.test.tsx` prendem o comportamento — os dois
falham contra o codigo antigo (confirmado com `git stash` antes de escrever
este registro).

De brinde: `NaoEncontradoError` gerava "Vistoria nao encontrado" sem
concordancia de genero. Corrigido passando a frase ja concordada em vez de
montar a partir do nome do recurso.

## Pecas do harness adiadas (candidatos)

- command `tdd`: entra com a primeira task de feature nova
- agent `revisor`: esperar a primeira revisao que polua a sessao
- skill de sincronizacao: a area fica no app, nao neste repositorio

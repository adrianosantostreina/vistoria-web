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

## Pecas do harness adiadas (candidatos)

Nenhum comando, skill ou agente foi criado ainda — seguindo o Capitulo 14, a
fundacao vem primeiro e o resto espera a dor real. Candidatos observados:

- command `novo-componente`: esperar a quarta repeticao
- command `tdd`: entra com a primeira task de feature nova
- agent `revisor`: esperar a primeira revisao que polua a sessao
- skill de sincronizacao: a area fica no app, nao neste repositorio

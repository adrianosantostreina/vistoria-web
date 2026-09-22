# Decisoes do projeto

Memoria do harness. Registra decisao tomada, data e motivo — para que ninguem
reabra o assunto sem caso novo, e para que a poda futura nao seja adivinhacao.

## API simulada no proprio repositorio (MSW)

Data: 2026-09. O painel precisa rodar sem backend para servir de material do
livro: o leitor clona, instala e abre. Os handlers ficam em `src/mocks/` e
valem tanto no navegador quanto nos testes, o que evita ter duas versoes da
mesma regra. Trocar por backend real exige refazer so a camada `services/`.

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

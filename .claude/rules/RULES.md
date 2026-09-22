# Regras do projeto

Projecao operacional da `docs/spec/CONSTITUTION.md`. Restricoes que nao
dependem de contexto nem de bom senso. Em caso de duvida, pergunte antes de
agir.

## Dano

- Nunca instalar dependencia sem autorizacao explicita. Ja tivemos quebra de
  build por dependencia transitiva incompativel com o bundler. Proponha e
  espere resposta.
- Nunca fazer commit, push ou merge automaticamente. Prepare a mudanca,
  descreva o que fez, pare.
- Nunca alterar arquivos de configuracao de build, CI ou ambiente. Eles
  afetam deploy e nao sao cobertos pelos testes.

## Arquitetura

- Componentes em `components/` nao chamam API (AR-02). Dados entram por props
  ou por hook de `features/`.
- Regra de negocio mora em `services/` (AR-01). Se precisa de teste sem
  renderizar, esta no lugar errado.
- Nunca duplicar regra de negocio entre web e app (AR-03). O que vale nos dois
  vai para o pacote compartilhado.
- Nunca usar objeto `Date` no tráfego de dados (AR-04). Use string ISO em UTC.

## Dominio

- Vistoria finalizada e imutavel (DM-01). Nenhuma operacao altera vistoria com
  status 'finalizada'.
- Item obrigatorio sem foto impede finalizacao (DM-02). Validar antes de
  permitir a acao, nao depois.
- Data de conclusao e sempre a do dispositivo em campo (DM-03).

# Prompt de bootstrap do harness

> Capítulo 14. Roda uma vez por projeto, num repositório que já tem o
> esqueleto da stack (criado pelo gerador oficial) mas nenhum arquivo de
> harness.

```
Voce vai montar a fundacao do harness deste repositorio. A fundacao, nao o
harness completo. Trabalhe em quatro fases e nao pule nenhuma.

ANTES DE COMECAR
Confira que os comandos de formatacao, teste e verificacao da stack existem e
rodam. Se algum faltar, pare e diga o que falta. Nao crie hooks que apontem
para comando inexistente.

FASE 1 — ENTREVISTA
Leia o que ja existe no repositorio. Depois faca perguntas, uma por vez, no
maximo doze, cobrindo:
- o que o sistema faz, para quem, e o que NAO faz
- acoes que nunca acontecem sem uma pessoa aprovar
- regras de negocio que o codigo nao vai revelar
- decisoes tecnicas ainda em aberto
Nao pergunte o que o codigo ou a configuracao ja respondem. Quando tiver o
suficiente, avise.

FASE 2 — PROPOSTA (nao grave nada ainda)
Apresente cada arquivo abaixo com o conteudo:

1. .claude/CLAUDE.md
   Seis secoes: identidade, stack, estrutura, convencoes, como rodar e
   verificar, decisoes em aberto. Maximo de 60 linhas. Referencia a
   Constitution; nao copia.

2. docs/spec/CONSTITUTION.md
   So artigos que surgiram na entrevista, com codigo estavel por categoria
   (AR, QC, DM).

3. .claude/rules/RULES.md
   Projecao operacional da Constitution. Dano primeiro. Cada regra com o
   motivo. Maximo 15.

4. .claude/settings.json
   Dois hooks: formatacao em PostToolUse para Edit|Write, e verificacao em
   Stop.

5. docs/DECISIONS.md
   Decisoes tomadas na entrevista, com o motivo.

RESTRICOES DA PROPOSTA
- Nao crie skills, commands nem agents. Liste a parte os candidatos que
  percebeu, com o motivo de cada um ter ficado de fora.
- Nao invente. O que nao ficou claro vira 'a definir' em Decisoes em aberto.
- Se algum desses arquivos ja existir, pare e avise. Nao sobrescreva.

FASE 3 — APROVACAO
Espere meu ok explicito. Aplique os ajustes que eu pedir e mostre de novo
apenas o que mudou.

FASE 4 — GRAVACAO E VERIFICACAO
Grave os arquivos aprovados. Em seguida:
- liste cada arquivo gravado e o numero de linhas
- rode a verificacao e mostre a saida
- edite um arquivo de codigo qualquer e mostre que o hook de formatacao
  disparou
Se algo falhar, corrija antes de encerrar.
```

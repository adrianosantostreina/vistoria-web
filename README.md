# Vistoria Web — projeto de exemplo do livro

Painel administrativo do sistema de vistorias em campo. É o projeto que
atravessa o livro **Desenvolvimento Acelerado com IA**, de Adriano Santos, e
existe para que os exemplos dos capítulos sejam código que roda de verdade —
não trechos ilustrativos.

O escritório usa este painel para cadastrar clientes, montar modelos de
vistoria e acompanhar o que foi concluído. O preenchimento em campo acontece
no aplicativo, que é outro repositório.

## Rodar

```bash
npm install
npm run dev      # abre em http://localhost:5173
```

Não precisa de backend nem de banco: a API é simulada com
[MSW](https://mswjs.io) dentro do próprio projeto, e os dados ficam no
`localStorage` do navegador. Para voltar ao estado inicial, limpe o storage do
site.

## Verificar

```bash
npm test         # suíte com Vitest + Testing Library
npm run check    # tsc --noEmit + oxlint
```

## O harness

Estes são os arquivos que os capítulos 14 e 15 ensinam a criar, aplicados a
este projeto:

| Arquivo | Papel | Capítulo |
|---|---|---|
| `CLAUDE.md` | Contexto — o que o agente lê em toda sessão | 4 e 14 |
| `.claude/rules/RULES.md` | Regras — o que nunca se faz aqui | 5 e 14 |
| `.claude/settings.json` | Hooks — formatação e verificação automáticas | 8 e 14 |
| `docs/spec/CONSTITUTION.md` | Constitution — regras com código citável | 11 e 14 |
| `docs/DECISIONS.md` | Memória — decisões e o motivo de cada uma | 8 e 15 |
| `prompts/` | Os prompts do livro, prontos para copiar | 14 e 15 |

Repare no que **não** existe aqui: nenhuma skill, nenhum comando, nenhum
agente. Não é esquecimento — é o argumento do capítulo 14. Essas peças esperam
a dor real que as justifique, e os candidatos observados estão listados no fim
do `docs/DECISIONS.md`.

## Estrutura

```
src/
  components/   componentes de UI sem regra de negócio
  features/     uma pasta por domínio (clientes, modelos, vistorias)
  services/     chamadas de API e regra de negócio pura
  mocks/        API simulada (handlers do MSW) e banco em memória
  types/        tipos compartilhados
```

As regras de domínio do livro estão implementadas e testadas em
`src/services/vistorias.ts`:

- **DM-01** — vistoria finalizada é imutável (a API recusa alterar e cancelar)
- **DM-02** — item obrigatório sem foto impede a finalização
- **DM-03** — a data de conclusão é a do dispositivo em campo

Rode `npm test` para ver as duas primeiras sendo verificadas.

## Licença

Material de apoio do livro. Use à vontade nos seus projetos.

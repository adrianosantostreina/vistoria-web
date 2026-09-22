# Vistoria Web

Painel administrativo do sistema de vistorias em campo. Usado pelo escritório
para cadastrar clientes, montar modelos de vistoria e acompanhar o que foi
concluído. O preenchimento em campo acontece no app (outro repositório).

## Stack

- React 19 + TypeScript (strict)
- Vite 8
- Tailwind CSS 4
- TanStack Query para estado de servidor
- Vitest + Testing Library
- MSW para a API simulada + SQLite (sql.js/WebAssembly) como banco
  (o projeto roda sem backend e sem servidor de banco)

## Estrutura

```
src/
  components/   componentes de UI sem regra de negocio
  features/     uma pasta por dominio (clientes, modelos, vistorias)
  services/     chamadas de API e regra de negocio pura
  mocks/        API simulada (handlers do MSW), schema e banco SQLite
  types/        tipos compartilhados
```

Componente fica em `src/components/{Nome}/{Nome}.tsx` com `index.ts`
exportando. Teste ao lado, mesmo nome.

## Convencoes

- Props tipadas por interface `{Nome}Props`, nunca `type`
- Estado de servidor sempre via TanStack Query, nunca `useState` + `useEffect`
- Erro tratado com throw de classe propria em `services/erros.ts`
- Datas trafegam como string ISO em UTC, nunca objeto `Date`

## Como rodar e verificar

```
npm install
npm run dev      # sobe em localhost:5173 (copia o wasm do SQLite antes)
npm test         # roda a suite
npm run check    # tsc --noEmit + oxlint
```

Rode `npm run check` antes de considerar qualquer tarefa concluida. O check
inclui a guarda da AR-02 em scripts/verificar-arquitetura.mjs.

O binario do SQLite nao e versionado: `predev` e `prebuild` copiam
sql-wasm-browser.wasm de node_modules para public/. Sao dois arquivos com
nomes diferentes (Node x navegador) — ver scripts/preparar-sqlite.mjs.

As regras inquebraveis do projeto estao em `docs/spec/CONSTITUTION.md`.
Nao copie o conteudo dela para ca — consulte a fonte.

## Decisoes em aberto

- Autenticacao ainda nao definida (provavel OAuth)
- Paginacao de listagens: offset ou cursor

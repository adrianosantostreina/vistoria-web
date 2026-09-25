---
description: Cria um componente novo com a estrutura padrao do projeto
  (arquivo, index, teste com renderizacao e estado vazio quando aplicavel).
argumentos: nome do componente, e o que ele faz em uma frase
---

Crie o componente $ARGUMENTS seguindo exatamente a estrutura deste projeto:

1. src/components/{Nome}/{Nome}.tsx
   - Props tipadas por interface {Nome}Props
   - Sem chamada de API, sem services/, sem useQuery/useMutation (AR-02).
     Dados entram por props.
   - Se o componente tem um estado "nada para mostrar", trate-o
     explicitamente — nao deixe a lista vazia renderizar em branco.

2. src/components/{Nome}/index.ts
   - Reexporta o componente e o tipo de props.

3. src/components/{Nome}/{Nome}.test.tsx
   - Um teste que renderiza sem erro.
   - Um teste por variante visual relevante (ex: cada valor de um enum de
     status, ou presenca/ausencia de uma prop opcional).
   - Se houver estado vazio, um teste dedicado a ele.

Nao chame API. Nao importe de services/ ou features/. Ao terminar, rode
npm run check e npm test e mostre a saida.

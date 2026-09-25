---
name: formulario-de-feature
description: Procedimento para criar a tela de uma feature em features/
  (lista + formulário de criação com TanStack Query). Use ao criar uma nova
  pasta em src/features/, ao adicionar useCriarX/useAgendarX, ou ao mexer em
  qualquer XPage.tsx que tenha form + mutation.
---

# Formulário de feature

## Quando usar

Toda vez que uma feature nova precisar de uma tela com lista + formulário de
criação — o padrão que ClientesPage, ModelosPage e VistoriasPage já seguem.
Não é sobre um componente específico; é sobre a sequência de decisões que se
repete ao montar essa tela.

## Procedimento

1. Hook de dados em `features/{nome}/use{Nome}.ts`: um `useQuery` para listar
   e um `useMutation` para criar, cada um com sua própria `queryKey`.

2. A mutation invalida a query no `onSuccess`:
   `queryClient.invalidateQueries({ queryKey: chave{Nome} })`. Sem isso, a
   lista não atualiza depois de criar — o registro existe no banco mas não
   aparece na tela até um F5.

3. Estado do formulário é local (`useState`), nunca no servidor. Ao enviar,
   chame `mutate` passando um `onSuccess` que **zera o formulário**. Sem esse
   segundo `onSuccess` — o da chamada, não o do hook — o campo fica com o
   texto antigo depois de salvar, e parece que o clique não fez nada.

4. O botão de envio usa `disabled={criar.isPending}` e troca o texto durante
   o envio (`"Salvando…"`). Sem isso, um duplo-clique dispara duas
   submissões.

5. Erro de mutation aparece perto do formulário, lendo
   `(criar.error as Error).message` — não um alerta genérico. A API simulada
   devolve mensagens específicas (ver `services/erros.ts`); descartá-las
   esconde a causa real de quem está testando o formulário.

6. Lista vazia usa `<EstadoVazio>`, nunca uma tabela ou grid em branco.

## Armadilhas

- Chamar `services/` ou `fetch` direto na página viola a AR-02. Os dados
  entram só pelo hook de `features/`.
- Dois `onSuccess` existem por design: o do hook (invalida a query) e o da
  chamada de `mutate` (limpa o formulário). Confundir os dois é o erro mais
  comum — o sintoma é a lista atualizando mas o campo continuando preenchido,
  ou o oposto.
- Repetir a mesma classe de botão em cada página é o sinal que já apareceu
  três vezes neste projeto — use o componente `Botao` em vez de inline.

## Como verificar

npm test — cada feature tem teste de service cobrindo a regra de domínio
correspondente (ver `services/*.test.ts`).

npm run check — garante que a página não importa de `services/` nem chama
`fetch` direto (AR-02).

/**
 * Erros de domínio. Services lançam estas classes; a camada de UI decide
 * como mostrá-las (ver RULES.md — erro tratado com throw de classe própria).
 */

export class ErroDeDominio extends Error {
  constructor(mensagem: string) {
    super(mensagem)
    this.name = new.target.name
  }
}

/** DM-01 — vistoria finalizada é imutável. */
export class VistoriaFinalizadaError extends ErroDeDominio {
  constructor() {
    super('Vistoria finalizada não pode ser alterada.')
  }
}

/** DM-02 — item obrigatório sem foto impede a finalização. */
export class ItemPendenteError extends ErroDeDominio {
  readonly pendentes: string[]

  constructor(pendentes: string[]) {
    super(
      `Itens obrigatórios sem foto impedem a finalização: ${pendentes.join(', ')}.`,
    )
    this.pendentes = pendentes
  }
}

/**
 * Recebe a frase já concordada ("Vistoria não encontrada.", "Modelo não
 * encontrado.") em vez de montar a frase a partir do nome do recurso — um
 * "Vistoria não encontrado" sem concordância de gênero é o tipo de erro que
 * passa despercebido porque não quebra teste nenhum, só soa errado.
 */
export class NaoEncontradoError extends ErroDeDominio {}

export class RequisicaoInvalidaError extends ErroDeDominio {}

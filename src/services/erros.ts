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

export class NaoEncontradoError extends ErroDeDominio {
  constructor(recurso: string) {
    super(`${recurso} não encontrado.`)
  }
}

export class RequisicaoInvalidaError extends ErroDeDominio {}

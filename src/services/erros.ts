/**
 * DM-01 e DM-02 vêm de vistoria-dominio, compartilhadas com o app de
 * campo. O que é só da camada HTTP deste painel (recurso não encontrado,
 * requisição inválida) continua aqui.
 */
export {
  ErroDeDominio,
  VistoriaFinalizadaError,
  ItemPendenteError,
} from 'vistoria-dominio'

import { ErroDeDominio } from 'vistoria-dominio'

/**
 * Recebe a frase já concordada ("Vistoria não encontrada.", "Modelo não
 * encontrado.") em vez de montar a frase a partir do nome do recurso — um
 * "Vistoria não encontrado" sem concordância de gênero é o tipo de erro que
 * passa despercebido porque não quebra teste nenhum, só soa errado.
 */
export class NaoEncontradoError extends ErroDeDominio {}

export class RequisicaoInvalidaError extends ErroDeDominio {}

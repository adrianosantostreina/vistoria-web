/**
 * Tipos compartilhados do painel de vistorias.
 *
 * `Vistoria` e `ItemVistoria` vêm de vistoria-dominio — a mesma forma usada
 * pelo app de campo. O que é só do painel (Cliente, ModeloVistoria, os
 * tipos de "novo X" para criar registro) continua aqui.
 *
 * Datas trafegam sempre como string ISO em UTC, nunca como objeto Date
 * (ver CONSTITUTION.md, artigo AR-04).
 */
export type { Vistoria, ItemVistoria, StatusVistoria, Situacao } from 'vistoria-dominio'

export interface Cliente {
  id: string
  nome: string
  documento: string
  cidade: string
  criadoEm: string
}

export interface ItemModelo {
  id: string
  descricao: string
  obrigatorio: boolean
}

export interface ModeloVistoria {
  id: string
  nome: string
  itens: ItemModelo[]
  criadoEm: string
}

export interface NovoCliente {
  nome: string
  documento: string
  cidade: string
}

export interface NovoModelo {
  nome: string
  itens: Array<{ descricao: string; obrigatorio: boolean }>
}

export interface NovaVistoria {
  clienteId: string
  modeloId: string
  agendadaPara: string
}

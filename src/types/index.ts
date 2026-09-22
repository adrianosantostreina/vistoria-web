/**
 * Tipos compartilhados do painel de vistorias.
 *
 * Datas trafegam sempre como string ISO em UTC, nunca como objeto Date
 * (ver CONSTITUTION.md, artigo AR-04).
 */

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

export type StatusVistoria = 'agendada' | 'em_andamento' | 'finalizada'

export interface ItemVistoria {
  id: string
  itemModeloId: string
  descricao: string
  obrigatorio: boolean
  situacao: 'pendente' | 'conforme' | 'nao_conforme'
  observacao: string
  fotoUrl: string | null
}

export interface Vistoria {
  id: string
  clienteId: string
  modeloId: string
  status: StatusVistoria
  agendadaPara: string
  /** Data do dispositivo em campo, não do servidor (DM-03). */
  concluidaEm: string | null
  itens: ItemVistoria[]
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

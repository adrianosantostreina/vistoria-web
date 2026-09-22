import { api } from './api'
import { RequisicaoInvalidaError } from './erros'
import type { ModeloVistoria, NovoModelo } from '../types'

export function listarModelos(): Promise<ModeloVistoria[]> {
  return api.get<ModeloVistoria[]>('/modelos')
}

/**
 * Um modelo sem nenhum item obrigatório produz vistoria que finaliza vazia —
 * o que torna a DM-02 inócua. Barramos na origem.
 */
export function validarModelo(dados: NovoModelo): void {
  if (!dados.nome.trim()) {
    throw new RequisicaoInvalidaError('Informe o nome do modelo.')
  }
  if (dados.itens.length === 0) {
    throw new RequisicaoInvalidaError('Um modelo precisa de ao menos um item.')
  }
  if (!dados.itens.some((item) => item.obrigatorio)) {
    throw new RequisicaoInvalidaError(
      'Um modelo precisa de ao menos um item obrigatório.',
    )
  }
}

export function criarModelo(dados: NovoModelo): Promise<ModeloVistoria> {
  validarModelo(dados)
  return api.post<ModeloVistoria>('/modelos', dados)
}

export function contarObrigatorios(modelo: ModeloVistoria): number {
  return modelo.itens.filter((item) => item.obrigatorio).length
}

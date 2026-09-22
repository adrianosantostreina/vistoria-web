import { api } from './api'
import { ItemPendenteError, VistoriaFinalizadaError } from './erros'
import type { NovaVistoria, Vistoria } from '../types'

/**
 * Regra de negócio pura — testável sem renderizar nada
 * (ver RULES.md: regra de negócio mora em services/).
 */

/** DM-02 — item obrigatório sem foto impede a finalização. */
export function itensObrigatoriosPendentes(vistoria: Vistoria): string[] {
  return vistoria.itens
    .filter((item) => item.obrigatorio && !item.fotoUrl)
    .map((item) => item.descricao)
}

export function podeFinalizar(vistoria: Vistoria): boolean {
  return (
    vistoria.status !== 'finalizada' &&
    itensObrigatoriosPendentes(vistoria).length === 0
  )
}

/** DM-01 — vistoria finalizada é imutável. */
export function garantirEditavel(vistoria: Vistoria): void {
  if (vistoria.status === 'finalizada') {
    throw new VistoriaFinalizadaError()
  }
}

/**
 * Validação local da finalização. O painel não finaliza — quem finaliza é o
 * app em campo —, mas a mesma regra é usada para exibir o motivo do bloqueio.
 */
export function validarFinalizacao(vistoria: Vistoria): void {
  garantirEditavel(vistoria)
  const pendentes = itensObrigatoriosPendentes(vistoria)
  if (pendentes.length > 0) {
    throw new ItemPendenteError(pendentes)
  }
}

export function progresso(vistoria: Vistoria): { feitos: number; total: number } {
  const total = vistoria.itens.length
  const feitos = vistoria.itens.filter((i) => i.situacao !== 'pendente').length
  return { feitos, total }
}

// ── Acesso à API ──────────────────────────────────────────────────────

export function listarVistorias(): Promise<Vistoria[]> {
  return api.get<Vistoria[]>('/vistorias')
}

export function obterVistoria(id: string): Promise<Vistoria> {
  return api.get<Vistoria>(`/vistorias/${id}`)
}

export function agendarVistoria(dados: NovaVistoria): Promise<Vistoria> {
  return api.post<Vistoria>('/vistorias', dados)
}

export function reagendarVistoria(
  id: string,
  agendadaPara: string,
): Promise<Vistoria> {
  return api.patch<Vistoria>(`/vistorias/${id}`, { agendadaPara })
}

export function cancelarVistoria(id: string): Promise<void> {
  return api.delete<void>(`/vistorias/${id}`)
}

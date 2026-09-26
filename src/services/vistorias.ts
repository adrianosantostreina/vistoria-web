import { api } from './api'
import type { NovaVistoria, Vistoria } from '../types'

/**
 * As regras puras (DM-01, DM-02, progresso) vêm de vistoria-dominio,
 * compartilhadas com o app de campo. Aqui fica só o acesso à API — a
 * parte que não faz sentido compartilhar entre navegador e aparelho.
 */
export {
  itensObrigatoriosPendentes,
  podeFinalizar,
  garantirEditavel,
  validarFinalizacao,
  progresso,
} from 'vistoria-dominio'

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

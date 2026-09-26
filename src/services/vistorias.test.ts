import { describe, expect, it } from 'vitest'
import {
  cancelarVistoria,
  listarVistorias,
  podeFinalizar,
  reagendarVistoria,
  validarFinalizacao,
} from './vistorias'
import { VistoriaFinalizadaError } from './erros'
import type { Vistoria } from '../types'

/**
 * As regras puras (DM-01, DM-02, progresso) têm cobertura completa em
 * vistoria-dominio — não repetida aqui. O teste abaixo é só o smoke test
 * de integração: confirma que o re-export chega até este projeto com o
 * mesmo comportamento, nada além disso.
 */
it('DM-01/DM-02 chegam de vistoria-dominio com o comportamento esperado', () => {
  const finalizada: Vistoria = {
    id: 'vis-x',
    clienteId: 'cli-1',
    modeloId: 'mod-1',
    status: 'finalizada',
    agendadaPara: '2026-03-10T12:00:00.000Z',
    concluidaEm: '2026-03-10T12:00:00.000Z',
    itens: [],
  }
  expect(() => validarFinalizacao(finalizada)).toThrow(VistoriaFinalizadaError)
  expect(podeFinalizar(finalizada)).toBe(false)
})

describe('acesso à API de vistorias', () => {
  it('lista as vistorias existentes', async () => {
    const lista = await listarVistorias()
    expect(lista).toHaveLength(3)
  })

  it('reagenda uma vistoria que ainda não foi finalizada', async () => {
    const nova = '2026-04-01T13:00:00.000Z'
    const atualizada = await reagendarVistoria('vis-3', nova)
    expect(atualizada.agendadaPara).toBe(nova)
  })

  it('DM-01: a API recusa reagendar vistoria finalizada', async () => {
    await expect(
      reagendarVistoria('vis-1', '2026-04-01T13:00:00.000Z'),
    ).rejects.toBeInstanceOf(VistoriaFinalizadaError)
  })

  it('DM-01: a API recusa cancelar vistoria finalizada', async () => {
    await expect(cancelarVistoria('vis-1')).rejects.toBeInstanceOf(
      VistoriaFinalizadaError,
    )
  })
})

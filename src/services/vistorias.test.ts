import { describe, expect, it } from 'vitest'
import {
  cancelarVistoria,
  garantirEditavel,
  itensObrigatoriosPendentes,
  listarVistorias,
  podeFinalizar,
  progresso,
  reagendarVistoria,
  validarFinalizacao,
} from './vistorias'
import { ItemPendenteError, VistoriaFinalizadaError } from './erros'
import type { Vistoria } from '../types'

function vistoria(parcial: Partial<Vistoria> = {}): Vistoria {
  return {
    id: 'vis-teste',
    clienteId: 'cli-1',
    modeloId: 'mod-1',
    status: 'em_andamento',
    agendadaPara: '2026-03-10T12:00:00.000Z',
    concluidaEm: null,
    itens: [
      {
        id: 'iv-1',
        itemModeloId: 'im-1',
        descricao: 'Estrutura de apoio',
        obrigatorio: true,
        situacao: 'conforme',
        observacao: '',
        fotoUrl: '/fotos/1.jpg',
      },
      {
        id: 'iv-2',
        itemModeloId: 'im-2',
        descricao: 'Calhas e rufos',
        obrigatorio: true,
        situacao: 'conforme',
        observacao: '',
        fotoUrl: '/fotos/2.jpg',
      },
      {
        id: 'iv-3',
        itemModeloId: 'im-3',
        descricao: 'Vegetação sobre o telhado',
        obrigatorio: false,
        situacao: 'pendente',
        observacao: '',
        fotoUrl: null,
      },
    ],
    ...parcial,
  }
}

function semFotoNoObrigatorio(): Vistoria {
  const v = vistoria()
  v.itens[1] = { ...v.itens[1], fotoUrl: null }
  return v
}

describe('regras de domínio da vistoria', () => {
  it('DM-02: bloqueia finalização com item obrigatório sem foto', () => {
    expect(() => validarFinalizacao(semFotoNoObrigatorio())).toThrow(
      ItemPendenteError,
    )
  })

  it('DM-02: item não obrigatório sem foto não impede a finalização', () => {
    expect(() => validarFinalizacao(vistoria())).not.toThrow()
    expect(podeFinalizar(vistoria())).toBe(true)
  })

  it('DM-02: informa quais itens estão pendentes', () => {
    expect(itensObrigatoriosPendentes(semFotoNoObrigatorio())).toEqual([
      'Calhas e rufos',
    ])
  })

  it('DM-01: vistoria finalizada é imutável', () => {
    const finalizada = vistoria({ status: 'finalizada' })
    expect(() => garantirEditavel(finalizada)).toThrow(VistoriaFinalizadaError)
    expect(podeFinalizar(finalizada)).toBe(false)
  })

  it('conta o progresso pelos itens já avaliados', () => {
    expect(progresso(vistoria())).toEqual({ feitos: 2, total: 3 })
  })
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

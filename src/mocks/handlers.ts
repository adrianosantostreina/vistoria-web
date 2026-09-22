import { http, HttpResponse } from 'msw'
import {
  abrirBanco,
  consultar,
  consultarUm,
  executar,
  novoId,
  persistir,
} from './db'
import type {
  Cliente,
  ItemModelo,
  ItemVistoria,
  ModeloVistoria,
  NovaVistoria,
  NovoCliente,
  NovoModelo,
  Vistoria,
} from '../types'

const agoraIso = () => new Date().toISOString()

function naoEncontrado(mensagem: string) {
  return HttpResponse.json({ erro: 'nao_encontrado', mensagem }, { status: 404 })
}

/** Linhas do SQLite: booleano é 0/1, nulo vem como null. */
interface LinhaItemModelo {
  id: string
  descricao: string
  obrigatorio: number
}

interface LinhaItemVistoria extends LinhaItemModelo {
  item_modelo_id: string
  situacao: ItemVistoria['situacao']
  observacao: string
  foto_url: string | null
}

interface LinhaVistoria {
  id: string
  cliente_id: string
  modelo_id: string
  status: Vistoria['status']
  agendada_para: string
  concluida_em: string | null
}

function itensDoModelo(modeloId: string): ItemModelo[] {
  return consultar<LinhaItemModelo>(
    `SELECT id, descricao, obrigatorio FROM item_modelo
      WHERE modelo_id = ? ORDER BY ordem`,
    [modeloId],
  ).map((linha) => ({
    id: linha.id,
    descricao: linha.descricao,
    obrigatorio: linha.obrigatorio === 1,
  }))
}

function itensDaVistoria(vistoriaId: string): ItemVistoria[] {
  return consultar<LinhaItemVistoria>(
    `SELECT id, item_modelo_id, descricao, obrigatorio, situacao,
            observacao, foto_url
       FROM item_vistoria WHERE vistoria_id = ? ORDER BY ordem`,
    [vistoriaId],
  ).map((linha) => ({
    id: linha.id,
    itemModeloId: linha.item_modelo_id,
    descricao: linha.descricao,
    obrigatorio: linha.obrigatorio === 1,
    situacao: linha.situacao,
    observacao: linha.observacao,
    fotoUrl: linha.foto_url,
  }))
}

function montarVistoria(linha: LinhaVistoria): Vistoria {
  return {
    id: linha.id,
    clienteId: linha.cliente_id,
    modeloId: linha.modelo_id,
    status: linha.status,
    agendadaPara: linha.agendada_para,
    concluidaEm: linha.concluida_em,
    itens: itensDaVistoria(linha.id),
  }
}

const COLUNAS_VISTORIA = `id, cliente_id, modelo_id, status,
                          agendada_para, concluida_em`

export const handlers = [
  // ── Clientes ────────────────────────────────────────────────────────
  http.get('/api/clientes', async () => {
    await abrirBanco()
    const linhas = consultar<{
      id: string
      nome: string
      documento: string
      cidade: string
      criado_em: string
    }>('SELECT id, nome, documento, cidade, criado_em FROM cliente')
    return HttpResponse.json(
      linhas.map<Cliente>((l) => ({
        id: l.id,
        nome: l.nome,
        documento: l.documento,
        cidade: l.cidade,
        criadoEm: l.criado_em,
      })),
    )
  }),

  http.post('/api/clientes', async ({ request }) => {
    await abrirBanco()
    const corpo = (await request.json()) as NovoCliente
    if (!corpo.nome?.trim()) {
      return HttpResponse.json(
        { erro: 'invalido', mensagem: 'Nome é obrigatório.' },
        { status: 400 },
      )
    }
    const cliente: Cliente = {
      id: novoId('cli'),
      nome: corpo.nome.trim(),
      documento: corpo.documento ?? '',
      cidade: corpo.cidade ?? '',
      criadoEm: agoraIso(),
    }
    executar(
      `INSERT INTO cliente (id, nome, documento, cidade, criado_em)
       VALUES (?, ?, ?, ?, ?)`,
      [
        cliente.id,
        cliente.nome,
        cliente.documento,
        cliente.cidade,
        cliente.criadoEm,
      ],
    )
    await persistir()
    return HttpResponse.json(cliente, { status: 201 })
  }),

  // ── Modelos ─────────────────────────────────────────────────────────
  http.get('/api/modelos', async () => {
    await abrirBanco()
    const linhas = consultar<{ id: string; nome: string; criado_em: string }>(
      'SELECT id, nome, criado_em FROM modelo ORDER BY criado_em',
    )
    return HttpResponse.json(
      linhas.map<ModeloVistoria>((l) => ({
        id: l.id,
        nome: l.nome,
        criadoEm: l.criado_em,
        itens: itensDoModelo(l.id),
      })),
    )
  }),

  http.post('/api/modelos', async ({ request }) => {
    await abrirBanco()
    const corpo = (await request.json()) as NovoModelo
    if (!corpo.nome?.trim() || !corpo.itens?.length) {
      return HttpResponse.json(
        {
          erro: 'invalido',
          mensagem: 'Modelo precisa de nome e ao menos um item.',
        },
        { status: 400 },
      )
    }

    const id = novoId('mod')
    const criadoEm = agoraIso()
    executar('INSERT INTO modelo (id, nome, criado_em) VALUES (?, ?, ?)', [
      id,
      corpo.nome.trim(),
      criadoEm,
    ])
    corpo.itens.forEach((item, ordem) => {
      executar(
        `INSERT INTO item_modelo (id, modelo_id, descricao, obrigatorio, ordem)
         VALUES (?, ?, ?, ?, ?)`,
        [novoId('im'), id, item.descricao, item.obrigatorio ? 1 : 0, ordem],
      )
    })
    await persistir()

    return HttpResponse.json(
      { id, nome: corpo.nome.trim(), criadoEm, itens: itensDoModelo(id) },
      { status: 201 },
    )
  }),

  // ── Vistorias ───────────────────────────────────────────────────────
  http.get('/api/vistorias', async () => {
    await abrirBanco()
    const linhas = consultar<LinhaVistoria>(
      `SELECT ${COLUNAS_VISTORIA} FROM vistoria ORDER BY agendada_para DESC`,
    )
    return HttpResponse.json(linhas.map(montarVistoria))
  }),

  http.get('/api/vistorias/:id', async ({ params }) => {
    await abrirBanco()
    const linha = consultarUm<LinhaVistoria>(
      `SELECT ${COLUNAS_VISTORIA} FROM vistoria WHERE id = ?`,
      [String(params.id)],
    )
    return linha ? HttpResponse.json(montarVistoria(linha)) : naoEncontrado('Vistoria')
  }),

  http.post('/api/vistorias', async ({ request }) => {
    await abrirBanco()
    const corpo = (await request.json()) as NovaVistoria

    const modelo = consultarUm<{ id: string }>(
      'SELECT id FROM modelo WHERE id = ?',
      [corpo.modeloId],
    )
    if (!modelo) return naoEncontrado('Modelo')

    const cliente = consultarUm<{ id: string }>(
      'SELECT id FROM cliente WHERE id = ?',
      [corpo.clienteId],
    )
    if (!cliente) return naoEncontrado('Cliente')

    const id = novoId('vis')
    executar(
      `INSERT INTO vistoria
         (id, cliente_id, modelo_id, status, agendada_para, concluida_em)
       VALUES (?, ?, ?, 'agendada', ?, NULL)`,
      [id, corpo.clienteId, corpo.modeloId, corpo.agendadaPara],
    )

    itensDoModelo(corpo.modeloId).forEach((item, ordem) => {
      executar(
        `INSERT INTO item_vistoria (id, vistoria_id, item_modelo_id, descricao,
           obrigatorio, situacao, observacao, foto_url, ordem)
         VALUES (?, ?, ?, ?, ?, 'pendente', '', NULL, ?)`,
        [novoId('iv'), id, item.id, item.descricao, item.obrigatorio ? 1 : 0, ordem],
      )
    })
    await persistir()

    const linha = consultarUm<LinhaVistoria>(
      `SELECT ${COLUNAS_VISTORIA} FROM vistoria WHERE id = ?`,
      [id],
    )!
    return HttpResponse.json(montarVistoria(linha), { status: 201 })
  }),

  /**
   * Reagendamento. O painel não preenche vistoria — isso acontece no app —
   * mas precisa respeitar a DM-01: vistoria finalizada é imutável.
   */
  http.patch('/api/vistorias/:id', async ({ params, request }) => {
    await abrirBanco()
    const id = String(params.id)
    const linha = consultarUm<LinhaVistoria>(
      `SELECT ${COLUNAS_VISTORIA} FROM vistoria WHERE id = ?`,
      [id],
    )
    if (!linha) return naoEncontrado('Vistoria')
    if (linha.status === 'finalizada') {
      return HttpResponse.json({ erro: 'vistoria_finalizada' }, { status: 409 })
    }

    const corpo = (await request.json()) as { agendadaPara?: string }
    if (corpo.agendadaPara) {
      executar('UPDATE vistoria SET agendada_para = ? WHERE id = ?', [
        corpo.agendadaPara,
        id,
      ])
      await persistir()
    }

    const atualizada = consultarUm<LinhaVistoria>(
      `SELECT ${COLUNAS_VISTORIA} FROM vistoria WHERE id = ?`,
      [id],
    )!
    return HttpResponse.json(montarVistoria(atualizada))
  }),

  http.delete('/api/vistorias/:id', async ({ params }) => {
    await abrirBanco()
    const id = String(params.id)
    const linha = consultarUm<LinhaVistoria>(
      `SELECT ${COLUNAS_VISTORIA} FROM vistoria WHERE id = ?`,
      [id],
    )
    if (!linha) return naoEncontrado('Vistoria')
    if (linha.status === 'finalizada') {
      return HttpResponse.json({ erro: 'vistoria_finalizada' }, { status: 409 })
    }

    executar('DELETE FROM item_vistoria WHERE vistoria_id = ?', [id])
    executar('DELETE FROM vistoria WHERE id = ?', [id])
    await persistir()
    return new HttpResponse(null, { status: 204 })
  }),
]

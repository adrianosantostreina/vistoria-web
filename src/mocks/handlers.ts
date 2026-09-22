import { http, HttpResponse } from 'msw'
import { novoId, obterBanco, salvarBanco } from './db'
import type {
  Cliente,
  ModeloVistoria,
  NovaVistoria,
  NovoCliente,
  NovoModelo,
  Vistoria,
} from '../types'

const agoraIso = () => new Date().toISOString()

function naoEncontrado(mensagem: string) {
  return HttpResponse.json(
    { erro: 'nao_encontrado', mensagem },
    { status: 404 },
  )
}

export const handlers = [
  // ── Clientes ────────────────────────────────────────────────────────
  http.get('/api/clientes', () => HttpResponse.json(obterBanco().clientes)),

  http.post('/api/clientes', async ({ request }) => {
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
    obterBanco().clientes.push(cliente)
    salvarBanco()
    return HttpResponse.json(cliente, { status: 201 })
  }),

  // ── Modelos de vistoria ─────────────────────────────────────────────
  http.get('/api/modelos', () => HttpResponse.json(obterBanco().modelos)),

  http.post('/api/modelos', async ({ request }) => {
    const corpo = (await request.json()) as NovoModelo
    if (!corpo.nome?.trim() || !corpo.itens?.length) {
      return HttpResponse.json(
        { erro: 'invalido', mensagem: 'Modelo precisa de nome e ao menos um item.' },
        { status: 400 },
      )
    }
    const modelo: ModeloVistoria = {
      id: novoId('mod'),
      nome: corpo.nome.trim(),
      criadoEm: agoraIso(),
      itens: corpo.itens.map((item) => ({
        id: novoId('im'),
        descricao: item.descricao,
        obrigatorio: item.obrigatorio,
      })),
    }
    obterBanco().modelos.push(modelo)
    salvarBanco()
    return HttpResponse.json(modelo, { status: 201 })
  }),

  // ── Vistorias ───────────────────────────────────────────────────────
  http.get('/api/vistorias', () => HttpResponse.json(obterBanco().vistorias)),

  http.get('/api/vistorias/:id', ({ params }) => {
    const vistoria = obterBanco().vistorias.find((v) => v.id === params.id)
    return vistoria ? HttpResponse.json(vistoria) : naoEncontrado('Vistoria')
  }),

  http.post('/api/vistorias', async ({ request }) => {
    const corpo = (await request.json()) as NovaVistoria
    const banco = obterBanco()
    const modelo = banco.modelos.find((m) => m.id === corpo.modeloId)
    const cliente = banco.clientes.find((c) => c.id === corpo.clienteId)

    if (!modelo) return naoEncontrado('Modelo')
    if (!cliente) return naoEncontrado('Cliente')

    const vistoria: Vistoria = {
      id: novoId('vis'),
      clienteId: cliente.id,
      modeloId: modelo.id,
      status: 'agendada',
      agendadaPara: corpo.agendadaPara,
      concluidaEm: null,
      itens: modelo.itens.map((item) => ({
        id: novoId('iv'),
        itemModeloId: item.id,
        descricao: item.descricao,
        obrigatorio: item.obrigatorio,
        situacao: 'pendente',
        observacao: '',
        fotoUrl: null,
      })),
    }
    banco.vistorias.push(vistoria)
    salvarBanco()
    return HttpResponse.json(vistoria, { status: 201 })
  }),

  /**
   * Reagendamento. O painel não preenche vistoria — isso acontece no app —
   * mas precisa respeitar a DM-01: vistoria finalizada é imutável.
   */
  http.patch('/api/vistorias/:id', async ({ params, request }) => {
    const vistoria = obterBanco().vistorias.find((v) => v.id === params.id)
    if (!vistoria) return naoEncontrado('Vistoria')

    if (vistoria.status === 'finalizada') {
      return HttpResponse.json({ erro: 'vistoria_finalizada' }, { status: 409 })
    }

    const corpo = (await request.json()) as { agendadaPara?: string }
    if (corpo.agendadaPara) vistoria.agendadaPara = corpo.agendadaPara
    salvarBanco()
    return HttpResponse.json(vistoria)
  }),

  http.delete('/api/vistorias/:id', ({ params }) => {
    const banco = obterBanco()
    const vistoria = banco.vistorias.find((v) => v.id === params.id)
    if (!vistoria) return naoEncontrado('Vistoria')

    if (vistoria.status === 'finalizada') {
      return HttpResponse.json({ erro: 'vistoria_finalizada' }, { status: 409 })
    }

    banco.vistorias = banco.vistorias.filter((v) => v.id !== params.id)
    salvarBanco()
    return new HttpResponse(null, { status: 204 })
  }),
]

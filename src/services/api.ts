import {
  ErroDeDominio,
  ItemPendenteError,
  NaoEncontradoError,
  RequisicaoInvalidaError,
  VistoriaFinalizadaError,
} from './erros'

const BASE = '/api'

interface RespostaDeErro {
  erro?: string
  mensagem?: string
  pendentes?: string[]
}

function traduzirErro(status: number, corpo: RespostaDeErro): ErroDeDominio {
  switch (corpo.erro) {
    case 'vistoria_finalizada':
      return new VistoriaFinalizadaError()
    case 'itens_pendentes':
      return new ItemPendenteError(corpo.pendentes ?? [])
    case 'nao_encontrado':
      return new NaoEncontradoError(corpo.mensagem ?? 'Registro')
    default:
      return new RequisicaoInvalidaError(
        corpo.mensagem ?? `Falha na requisição (HTTP ${status}).`,
      )
  }
}

async function requisitar<T>(caminho: string, init?: RequestInit): Promise<T> {
  const resposta = await fetch(`${BASE}${caminho}`, {
    ...init,
    headers: { 'Content-Type': 'application/json', ...init?.headers },
  })

  if (!resposta.ok) {
    const corpo = (await resposta.json().catch(() => ({}))) as RespostaDeErro
    throw traduzirErro(resposta.status, corpo)
  }

  if (resposta.status === 204) {
    return undefined as T
  }

  return (await resposta.json()) as T
}

export const api = {
  get: <T>(caminho: string) => requisitar<T>(caminho),
  post: <T>(caminho: string, corpo: unknown) =>
    requisitar<T>(caminho, { method: 'POST', body: JSON.stringify(corpo) }),
  patch: <T>(caminho: string, corpo: unknown) =>
    requisitar<T>(caminho, { method: 'PATCH', body: JSON.stringify(corpo) }),
  delete: <T>(caminho: string) =>
    requisitar<T>(caminho, { method: 'DELETE' }),
}

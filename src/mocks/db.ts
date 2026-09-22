/**
 * Banco em memória da API simulada.
 *
 * Existe para que o projeto rode sem servidor e sem banco: o leitor clona,
 * instala e abre. No navegador, o estado é persistido em localStorage para
 * sobreviver a um F5; nos testes, cada caso começa do zero.
 */
import type {
  Cliente,
  ModeloVistoria,
  Vistoria,
} from '../types'

export interface Banco {
  clientes: Cliente[]
  modelos: ModeloVistoria[]
  vistorias: Vistoria[]
}

const CHAVE = 'vistoria-web:banco'

function iso(dias: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString()
}

export function sementes(): Banco {
  const modeloTelhado: ModeloVistoria = {
    id: 'mod-1',
    nome: 'Telhado residencial',
    criadoEm: iso(-30),
    itens: [
      { id: 'im-1', descricao: 'Estrutura de apoio', obrigatorio: true },
      { id: 'im-2', descricao: 'Calhas e rufos', obrigatorio: true },
      { id: 'im-3', descricao: 'Telhas quebradas', obrigatorio: true },
      { id: 'im-4', descricao: 'Vegetação sobre o telhado', obrigatorio: false },
    ],
  }

  const modeloFachada: ModeloVistoria = {
    id: 'mod-2',
    nome: 'Fachada comercial',
    criadoEm: iso(-20),
    itens: [
      { id: 'im-5', descricao: 'Revestimento', obrigatorio: true },
      { id: 'im-6', descricao: 'Esquadrias', obrigatorio: false },
    ],
  }

  const clientes: Cliente[] = [
    {
      id: 'cli-1',
      nome: 'Construtora Aurora',
      documento: '12.345.678/0001-90',
      cidade: 'São Paulo',
      criadoEm: iso(-40),
    },
    {
      id: 'cli-2',
      nome: 'Condomínio Parque das Flores',
      documento: '98.765.432/0001-10',
      cidade: 'Campinas',
      criadoEm: iso(-15),
    },
  ]

  const vistorias: Vistoria[] = [
    {
      id: 'vis-1',
      clienteId: 'cli-1',
      modeloId: 'mod-1',
      status: 'finalizada',
      agendadaPara: iso(-7),
      concluidaEm: iso(-7),
      itens: modeloTelhado.itens.map((item, i) => ({
        id: `iv-${i + 1}`,
        itemModeloId: item.id,
        descricao: item.descricao,
        obrigatorio: item.obrigatorio,
        situacao: i === 2 ? 'nao_conforme' : 'conforme',
        observacao: i === 2 ? 'Três telhas trincadas na água oeste.' : '',
        fotoUrl: item.obrigatorio ? `/fotos/vis-1-${i + 1}.jpg` : null,
      })),
    },
    {
      id: 'vis-2',
      clienteId: 'cli-2',
      modeloId: 'mod-1',
      status: 'em_andamento',
      agendadaPara: iso(-1),
      concluidaEm: null,
      itens: modeloTelhado.itens.map((item, i) => ({
        id: `iv-1${i + 1}`,
        itemModeloId: item.id,
        descricao: item.descricao,
        obrigatorio: item.obrigatorio,
        situacao: i === 0 ? 'conforme' : 'pendente',
        observacao: '',
        fotoUrl: i === 0 ? '/fotos/vis-2-1.jpg' : null,
      })),
    },
    {
      id: 'vis-3',
      clienteId: 'cli-1',
      modeloId: 'mod-2',
      status: 'agendada',
      agendadaPara: iso(3),
      concluidaEm: null,
      itens: modeloFachada.itens.map((item, i) => ({
        id: `iv-2${i + 1}`,
        itemModeloId: item.id,
        descricao: item.descricao,
        obrigatorio: item.obrigatorio,
        situacao: 'pendente',
        observacao: '',
        fotoUrl: null,
      })),
    },
  ]

  return { clientes, modelos: [modeloTelhado, modeloFachada], vistorias }
}

function carregar(): Banco {
  if (typeof localStorage === 'undefined') return sementes()
  const bruto = localStorage.getItem(CHAVE)
  if (!bruto) return sementes()
  try {
    return JSON.parse(bruto) as Banco
  } catch {
    return sementes()
  }
}

let banco: Banco = carregar()

export function obterBanco(): Banco {
  return banco
}

export function salvarBanco(): void {
  if (typeof localStorage === 'undefined') return
  localStorage.setItem(CHAVE, JSON.stringify(banco))
}

export function resetarBanco(): void {
  banco = sementes()
  if (typeof localStorage !== 'undefined') localStorage.removeItem(CHAVE)
}

export function novoId(prefixo: string): string {
  return `${prefixo}-${Math.random().toString(36).slice(2, 9)}`
}

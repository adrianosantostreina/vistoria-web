import { api } from './api'
import type { Cliente, NovoCliente } from '../types'

export function listarClientes(): Promise<Cliente[]> {
  return api.get<Cliente[]>('/clientes')
}

export function criarCliente(dados: NovoCliente): Promise<Cliente> {
  return api.post<Cliente>('/clientes', dados)
}

export function ordenarPorNome(clientes: Cliente[]): Cliente[] {
  return [...clientes].sort((a, b) => a.nome.localeCompare(b.nome, 'pt-BR'))
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarCliente, listarClientes, ordenarPorNome } from '../../services/clientes'
import type { NovoCliente } from '../../types'

export const chaveClientes = ['clientes'] as const

export function useClientes() {
  return useQuery({
    queryKey: chaveClientes,
    queryFn: listarClientes,
    select: ordenarPorNome,
  })
}

export function useCriarCliente() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: NovoCliente) => criarCliente(dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaveClientes }),
  })
}

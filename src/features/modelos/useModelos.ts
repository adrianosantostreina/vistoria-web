import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { criarModelo, listarModelos } from '../../services/modelos'
import type { NovoModelo } from '../../types'

export const chaveModelos = ['modelos'] as const

export function useModelos() {
  return useQuery({ queryKey: chaveModelos, queryFn: listarModelos })
}

export function useCriarModelo() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: NovoModelo) => criarModelo(dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaveModelos }),
  })
}

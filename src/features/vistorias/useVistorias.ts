import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  agendarVistoria,
  cancelarVistoria,
  listarVistorias,
  reagendarVistoria,
} from '../../services/vistorias'
import type { NovaVistoria } from '../../types'

export const chaveVistorias = ['vistorias'] as const

export function useVistorias() {
  return useQuery({ queryKey: chaveVistorias, queryFn: listarVistorias })
}

export function useAgendarVistoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (dados: NovaVistoria) => agendarVistoria(dados),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaveVistorias }),
  })
}

export function useReagendarVistoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, agendadaPara }: { id: string; agendadaPara: string }) =>
      reagendarVistoria(id, agendadaPara),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaveVistorias }),
  })
}

export function useCancelarVistoria() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => cancelarVistoria(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: chaveVistorias }),
  })
}

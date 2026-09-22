import type { StatusVistoria } from '../../types'

export interface StatusBadgeProps {
  status: StatusVistoria
}

const ESTILOS: Record<StatusVistoria, { rotulo: string; classe: string }> = {
  agendada: { rotulo: 'Agendada', classe: 'bg-sky-100 text-sky-800' },
  em_andamento: { rotulo: 'Em andamento', classe: 'bg-amber-100 text-amber-800' },
  finalizada: { rotulo: 'Finalizada', classe: 'bg-emerald-100 text-emerald-800' },
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const { rotulo, classe } = ESTILOS[status]
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${classe}`}
    >
      {rotulo}
    </span>
  )
}

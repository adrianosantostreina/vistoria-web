export interface EstadoVazioProps {
  titulo: string
  descricao?: string
}

export function EstadoVazio({ titulo, descricao }: EstadoVazioProps) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white px-6 py-10 text-center">
      <p className="font-medium text-slate-700">{titulo}</p>
      {descricao && <p className="mt-1 text-sm text-slate-500">{descricao}</p>}
    </div>
  )
}

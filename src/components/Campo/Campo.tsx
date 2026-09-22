import type { InputHTMLAttributes } from 'react'
import { useId } from 'react'

export interface CampoProps extends InputHTMLAttributes<HTMLInputElement> {
  rotulo: string
}

export function Campo({ rotulo, ...resto }: CampoProps) {
  const id = useId()
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className="text-sm font-medium text-slate-700">
        {rotulo}
      </label>
      <input
        id={id}
        className="rounded-md border border-slate-300 px-3 py-2 text-sm outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
        {...resto}
      />
    </div>
  )
}

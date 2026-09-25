import type { ButtonHTMLAttributes } from 'react'

export interface BotaoProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variante?: 'primaria' | 'secundaria'
  tamanho?: 'padrao' | 'compacto'
}

/**
 * Tamanho e cor não ficam soltos no `className` do chamador — viram props.
 *
 * O motivo é uma colisão real: um primeiro rascunho deixava o chamador
 * sobrescrever o padding via `className="px-3 py-1"`. O tsc e o linter não
 * reclamaram, os testes passaram — e o botão saiu do tamanho errado assim
 * mesmo, porque CSS resolve classes repetidas pela ordem no stylesheet
 * gerado, não pela ordem em que elas aparecem no atributo `class`. Com
 * `tamanho` como prop, não existem duas classes de padding disputando o
 * mesmo elemento.
 */
const CLASSE_BASE = 'rounded-md text-sm font-medium disabled:opacity-60'

const CLASSE_POR_VARIANTE: Record<NonNullable<BotaoProps['variante']>, string> = {
  primaria: 'bg-sky-600 text-white hover:bg-sky-700',
  secundaria: 'border border-slate-300 text-slate-700 hover:bg-slate-50',
}

const CLASSE_POR_TAMANHO: Record<NonNullable<BotaoProps['tamanho']>, string> = {
  padrao: 'px-4 py-2',
  compacto: 'px-3 py-1',
}

export function Botao({
  variante = 'primaria',
  tamanho = 'padrao',
  className,
  ...resto
}: BotaoProps) {
  const classe = [
    CLASSE_BASE,
    CLASSE_POR_VARIANTE[variante],
    CLASSE_POR_TAMANHO[tamanho],
    className,
  ]
    .filter(Boolean)
    .join(' ')
  return <button className={classe} {...resto} />
}

import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Botao } from './Botao'

describe('Botao', () => {
  it('renderiza o conteúdo e responde ao clique', async () => {
    const aoClicar = vi.fn()
    render(<Botao onClick={aoClicar}>Salvar</Botao>)
    await userEvent.click(screen.getByRole('button', { name: 'Salvar' }))
    expect(aoClicar).toHaveBeenCalledOnce()
  })

  it('usa a variante primária por padrão', () => {
    render(<Botao>Padrão</Botao>)
    expect(screen.getByRole('button').className).toContain('bg-sky-600')
  })

  it('aplica a variante secundária quando pedida', () => {
    render(<Botao variante="secundaria">Cancelar</Botao>)
    const classe = screen.getByRole('button').className
    expect(classe).toContain('border-slate-300')
    expect(classe).not.toContain('bg-sky-600')
  })

  it('fica desabilitado quando a prop disabled é passada', () => {
    render(<Botao disabled>Salvando…</Botao>)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('o tamanho compacto não deixa a classe padrão sobrando', () => {
    render(<Botao tamanho="compacto">Cancelar</Botao>)
    const classe = screen.getByRole('button').className
    expect(classe).toContain('px-3')
    expect(classe).not.toContain('px-4')
  })
})

import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { EstadoVazio } from './EstadoVazio'

describe('EstadoVazio', () => {
  it('renderiza o título', () => {
    render(<EstadoVazio titulo="Nenhum cliente cadastrado" />)
    expect(screen.getByText('Nenhum cliente cadastrado')).toBeInTheDocument()
  })

  it('mostra a descrição quando informada', () => {
    render(<EstadoVazio titulo="Vazio" descricao="Cadastre o primeiro." />)
    expect(screen.getByText('Cadastre o primeiro.')).toBeInTheDocument()
  })

  it('omite a descrição quando não informada', () => {
    const { container } = render(<EstadoVazio titulo="Vazio" />)
    expect(container.querySelectorAll('p')).toHaveLength(1)
  })
})

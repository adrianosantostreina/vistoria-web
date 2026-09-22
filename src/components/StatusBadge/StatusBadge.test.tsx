import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { StatusBadge } from './StatusBadge'

describe('StatusBadge', () => {
  it('traduz cada status para o rótulo em português', () => {
    render(<StatusBadge status="em_andamento" />)
    expect(screen.getByText('Em andamento')).toBeInTheDocument()
  })

  it('usa cor distinta para vistoria finalizada', () => {
    render(<StatusBadge status="finalizada" />)
    expect(screen.getByText('Finalizada').className).toContain('emerald')
  })
})

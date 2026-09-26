import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { HttpResponse, delay, http } from 'msw'
import { describe, expect, it } from 'vitest'
import { server } from '../../mocks/server'
import { VistoriasPage } from './VistoriasPage'

function renderPagina() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false }, mutations: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <VistoriasPage />
    </QueryClientProvider>,
  )
}

describe('VistoriasPage — cancelar', () => {
  it('desabilita só o botão clicado, não os das outras vistorias', async () => {
    // atrasa a resposta para conseguir observar o estado "no meio do caminho"
    server.use(
      http.delete('/api/vistorias/:id', async () => {
        await delay(200)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderPagina()
    const botoes = await screen.findAllByRole('button', {
      name: 'Cancelar vistoria',
    })
    expect(botoes.length).toBeGreaterThan(1)

    await userEvent.click(botoes[0])

    // o botão clicado entra em "Cancelando…"; os outros continuam normais
    expect(
      await screen.findByRole('button', { name: 'Cancelando…' }),
    ).toBeDisabled()
    const outros = screen.getAllByRole('button', { name: 'Cancelar vistoria' })
    for (const botao of outros) {
      expect(botao).not.toBeDisabled()
    }
  })

  it('um segundo clique no mesmo botão não dispara uma segunda requisição', async () => {
    let chamadas = 0
    server.use(
      http.delete('/api/vistorias/:id', async () => {
        chamadas++
        await delay(150)
        return new HttpResponse(null, { status: 204 })
      }),
    )

    renderPagina()
    const [primeiro] = await screen.findAllByRole('button', {
      name: 'Cancelar vistoria',
    })

    await userEvent.click(primeiro)
    // o botão já está desabilitado — um clique aqui não deveria fazer nada
    await userEvent.click(screen.getByRole('button', { name: 'Cancelando…' }))

    await waitFor(() => expect(chamadas).toBe(1))
  })
})

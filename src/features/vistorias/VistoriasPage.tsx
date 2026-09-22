import { useMemo, useState, type FormEvent } from 'react'
import { EstadoVazio } from '../../components/EstadoVazio'
import { StatusBadge } from '../../components/StatusBadge'
import {
  itensObrigatoriosPendentes,
  progresso,
} from '../../services/vistorias'
import { useClientes } from '../clientes/useClientes'
import { useModelos } from '../modelos/useModelos'
import {
  useAgendarVistoria,
  useCancelarVistoria,
  useVistorias,
} from './useVistorias'

function formatarData(iso: string): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(iso))
}

export function VistoriasPage() {
  const { data: vistorias, isPending } = useVistorias()
  const { data: clientes } = useClientes()
  const { data: modelos } = useModelos()
  const agendar = useAgendarVistoria()
  const cancelar = useCancelarVistoria()

  const [clienteId, setClienteId] = useState('')
  const [modeloId, setModeloId] = useState('')
  const [data, setData] = useState('')

  const nomePorCliente = useMemo(
    () => new Map(clientes?.map((c) => [c.id, c.nome])),
    [clientes],
  )
  const nomePorModelo = useMemo(
    () => new Map(modelos?.map((m) => [m.id, m.nome])),
    [modelos],
  )

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    agendar.mutate(
      {
        clienteId,
        modeloId,
        agendadaPara: new Date(`${data}T12:00:00`).toISOString(),
      },
      { onSuccess: () => setData('') },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Vistorias</h2>

        {isPending && <p className="text-sm text-slate-500">Carregando…</p>}

        {vistorias && vistorias.length === 0 && (
          <EstadoVazio
            titulo="Nenhuma vistoria agendada"
            descricao="Agende a primeira usando o formulário ao lado."
          />
        )}

        <div className="grid gap-3">
          {vistorias?.map((vistoria) => {
            const { feitos, total } = progresso(vistoria)
            const pendentes = itensObrigatoriosPendentes(vistoria)
            const finalizada = vistoria.status === 'finalizada'

            return (
              <article
                key={vistoria.id}
                className="rounded-lg border border-slate-200 bg-white p-4"
              >
                <header className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="font-medium text-slate-900">
                      {nomePorCliente.get(vistoria.clienteId) ?? 'Cliente removido'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {nomePorModelo.get(vistoria.modeloId) ?? 'Modelo removido'} ·{' '}
                      {formatarData(vistoria.agendadaPara)}
                    </p>
                  </div>
                  <StatusBadge status={vistoria.status} />
                </header>

                <p className="mt-3 text-sm text-slate-600">
                  {feitos} de {total} itens avaliados
                  {finalizada && vistoria.concluidaEm && (
                    <> · concluída em {formatarData(vistoria.concluidaEm)}</>
                  )}
                </p>

                {!finalizada && pendentes.length > 0 && (
                  <p className="mt-1 text-sm text-amber-700">
                    Não finaliza enquanto faltar foto em: {pendentes.join(', ')}.
                  </p>
                )}

                <footer className="mt-3">
                  {finalizada ? (
                    <span className="text-xs text-slate-500">
                      Vistoria finalizada não pode ser alterada.
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => cancelar.mutate(vistoria.id)}
                      className="rounded-md border border-slate-300 px-3 py-1 text-sm text-slate-700 hover:bg-slate-50"
                    >
                      Cancelar vistoria
                    </button>
                  )}
                </footer>
              </article>
            )
          })}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Agendar</h2>
        <form
          onSubmit={enviar}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Cliente
            <select
              required
              value={clienteId}
              onChange={(e) => setClienteId(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
            >
              <option value="">Selecione…</option>
              {clientes?.map((cliente) => (
                <option key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Modelo
            <select
              required
              value={modeloId}
              onChange={(e) => setModeloId(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
            >
              <option value="">Selecione…</option>
              {modelos?.map((modelo) => (
                <option key={modelo.id} value={modelo.id}>
                  {modelo.nome}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 text-sm font-medium text-slate-700">
            Data
            <input
              type="date"
              required
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm font-normal"
            />
          </label>

          <button
            type="submit"
            disabled={agendar.isPending}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            Agendar vistoria
          </button>
          {agendar.isError && (
            <p className="text-sm text-red-600">{(agendar.error as Error).message}</p>
          )}
          {cancelar.isError && (
            <p className="text-sm text-red-600">{(cancelar.error as Error).message}</p>
          )}
        </form>
      </section>
    </div>
  )
}

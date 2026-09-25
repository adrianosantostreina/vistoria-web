import { useState, type FormEvent } from 'react'
import { Botao } from '../../components/Botao'
import { Campo } from '../../components/Campo'
import { EstadoVazio } from '../../components/EstadoVazio'
import { useClientes, useCriarCliente } from './useClientes'

const VAZIO = { nome: '', documento: '', cidade: '' }

export function ClientesPage() {
  const { data: clientes, isPending, isError } = useClientes()
  const criar = useCriarCliente()
  const [form, setForm] = useState(VAZIO)

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    criar.mutate(form, { onSuccess: () => setForm(VAZIO) })
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Clientes</h2>

        {isPending && <p className="text-sm text-slate-500">Carregando…</p>}
        {isError && (
          <p className="text-sm text-red-600">Não foi possível carregar os clientes.</p>
        )}

        {clientes && clientes.length === 0 && (
          <EstadoVazio
            titulo="Nenhum cliente cadastrado"
            descricao="Use o formulário ao lado para cadastrar o primeiro."
          />
        )}

        {clientes && clientes.length > 0 && (
          <div className="overflow-hidden rounded-lg border border-slate-200 bg-white">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 text-left text-slate-600">
                <tr>
                  <th className="px-4 py-2 font-medium">Nome</th>
                  <th className="px-4 py-2 font-medium">Documento</th>
                  <th className="px-4 py-2 font-medium">Cidade</th>
                </tr>
              </thead>
              <tbody>
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="border-t border-slate-100">
                    <td className="px-4 py-2 font-medium text-slate-800">{cliente.nome}</td>
                    <td className="px-4 py-2 text-slate-600">{cliente.documento}</td>
                    <td className="px-4 py-2 text-slate-600">{cliente.cidade}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Novo cliente</h2>
        <form
          onSubmit={enviar}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <Campo
            rotulo="Nome"
            value={form.nome}
            required
            onChange={(e) => setForm({ ...form, nome: e.target.value })}
          />
          <Campo
            rotulo="Documento"
            value={form.documento}
            onChange={(e) => setForm({ ...form, documento: e.target.value })}
          />
          <Campo
            rotulo="Cidade"
            value={form.cidade}
            onChange={(e) => setForm({ ...form, cidade: e.target.value })}
          />
          <Botao type="submit" disabled={criar.isPending} className="mt-1">
            {criar.isPending ? 'Salvando…' : 'Cadastrar'}
          </Botao>
          {criar.isError && (
            <p className="text-sm text-red-600">{(criar.error as Error).message}</p>
          )}
        </form>
      </section>
    </div>
  )
}

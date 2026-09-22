import { useState, type FormEvent } from 'react'
import { Campo } from '../../components/Campo'
import { EstadoVazio } from '../../components/EstadoVazio'
import { contarObrigatorios } from '../../services/modelos'
import { useCriarModelo, useModelos } from './useModelos'

interface ItemEmEdicao {
  descricao: string
  obrigatorio: boolean
}

export function ModelosPage() {
  const { data: modelos, isPending } = useModelos()
  const criar = useCriarModelo()

  const [nome, setNome] = useState('')
  const [itens, setItens] = useState<ItemEmEdicao[]>([])
  const [descricao, setDescricao] = useState('')
  const [obrigatorio, setObrigatorio] = useState(true)

  function adicionarItem() {
    if (!descricao.trim()) return
    setItens([...itens, { descricao: descricao.trim(), obrigatorio }])
    setDescricao('')
    setObrigatorio(true)
  }

  function enviar(evento: FormEvent) {
    evento.preventDefault()
    criar.mutate(
      { nome, itens },
      {
        onSuccess: () => {
          setNome('')
          setItens([])
        },
      },
    )
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">
          Modelos de vistoria
        </h2>

        {isPending && <p className="text-sm text-slate-500">Carregando…</p>}

        {modelos && modelos.length === 0 && (
          <EstadoVazio
            titulo="Nenhum modelo criado"
            descricao="O modelo define o checklist que o vistoriador percorre em campo."
          />
        )}

        <div className="grid gap-3">
          {modelos?.map((modelo) => (
            <article
              key={modelo.id}
              className="rounded-lg border border-slate-200 bg-white p-4"
            >
              <header className="flex items-baseline justify-between">
                <h3 className="font-medium text-slate-900">{modelo.nome}</h3>
                <span className="text-xs text-slate-500">
                  {modelo.itens.length} itens · {contarObrigatorios(modelo)} obrigatórios
                </span>
              </header>
              <ul className="mt-2 grid gap-1 text-sm text-slate-600">
                {modelo.itens.map((item) => (
                  <li key={item.id} className="flex items-center gap-2">
                    <span
                      className={
                        item.obrigatorio
                          ? 'inline-block h-1.5 w-1.5 rounded-full bg-sky-600'
                          : 'inline-block h-1.5 w-1.5 rounded-full bg-slate-300'
                      }
                    />
                    {item.descricao}
                    {item.obrigatorio && (
                      <span className="text-xs text-sky-700">exige foto</span>
                    )}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold text-slate-900">Novo modelo</h2>
        <form
          onSubmit={enviar}
          className="flex flex-col gap-3 rounded-lg border border-slate-200 bg-white p-4"
        >
          <Campo rotulo="Nome do modelo" value={nome} required onChange={(e) => setNome(e.target.value)} />

          <div className="border-t border-slate-100 pt-3">
            <Campo
              rotulo="Item do checklist"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
            />
            <label className="mt-2 flex items-center gap-2 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={obrigatorio}
                onChange={(e) => setObrigatorio(e.target.checked)}
              />
              Obrigatório (exige foto para finalizar)
            </label>
            <button
              type="button"
              onClick={adicionarItem}
              className="mt-2 w-full rounded-md border border-slate-300 px-3 py-1.5 text-sm hover:bg-slate-50"
            >
              Adicionar item
            </button>
          </div>

          {itens.length > 0 && (
            <ul className="grid gap-1 text-sm text-slate-600">
              {itens.map((item, i) => (
                <li key={i}>
                  • {item.descricao} {item.obrigatorio && <em className="text-xs">(obrigatório)</em>}
                </li>
              ))}
            </ul>
          )}

          <button
            type="submit"
            disabled={criar.isPending}
            className="rounded-md bg-sky-600 px-4 py-2 text-sm font-medium text-white hover:bg-sky-700 disabled:opacity-60"
          >
            Criar modelo
          </button>
          {criar.isError && (
            <p className="text-sm text-red-600">{(criar.error as Error).message}</p>
          )}
        </form>
      </section>
    </div>
  )
}

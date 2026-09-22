import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import { ClientesPage } from './features/clientes/ClientesPage'
import { ModelosPage } from './features/modelos/ModelosPage'
import { VistoriasPage } from './features/vistorias/VistoriasPage'

const ABAS = [
  { para: '/vistorias', rotulo: 'Vistorias' },
  { para: '/clientes', rotulo: 'Clientes' },
  { para: '/modelos', rotulo: 'Modelos' },
]

export default function App() {
  return (
    <div className="min-h-screen">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-4">
          <h1 className="text-xl font-semibold text-slate-900">Vistoria Web</h1>
          <p className="text-sm text-slate-500">
            Painel do escritório — o preenchimento em campo acontece no app.
          </p>
          <nav className="mt-4 flex gap-1">
            {ABAS.map((aba) => (
              <NavLink
                key={aba.para}
                to={aba.para}
                className={({ isActive }) =>
                  `rounded-md px-3 py-1.5 text-sm font-medium ${
                    isActive
                      ? 'bg-sky-600 text-white'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {aba.rotulo}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6">
        <Routes>
          <Route path="/" element={<Navigate to="/vistorias" replace />} />
          <Route path="/vistorias" element={<VistoriasPage />} />
          <Route path="/clientes" element={<ClientesPage />} />
          <Route path="/modelos" element={<ModelosPage />} />
        </Routes>
      </main>
    </div>
  )
}

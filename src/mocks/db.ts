/**
 * Banco SQLite da API simulada.
 *
 * É SQLite de verdade — o mesmo motor, compilado para WebAssembly pelo
 * sql.js. No navegador, o arquivo do banco é persistido em IndexedDB e
 * sobrevive ao F5; nos testes, cada caso começa com um banco novo em memória.
 *
 * Ver docs/DECISIONS.md para o porquê desta escolha.
 */
import initSqlJs, { type Database, type SqlValue } from 'sql.js'
import { SCHEMA } from './schema.sql'

const CHAVE_IDB = 'banco'
const NOME_IDB = 'vistoria-web'

let db: Database | null = null

// ── Inicialização ─────────────────────────────────────────────────────

/**
 * O arquivo roda em dois ambientes — navegador e Node (testes) — e o tipo de
 * `process` não pertence a nenhum dos dois: declarar `@types/node` aqui
 * abriria a API inteira do Node para o código do navegador. A declaração
 * mínima abaixo descreve só o que é realmente usado.
 */
declare const process:
  | { versions?: { node?: string }; cwd(): string }
  | undefined

/**
 * Onde o binário do SQLite mora em cada ambiente.
 *
 * Atenção ao teste de ambiente: não dá para perguntar por `window`, porque o
 * jsdom define `window` nos testes — e o Node acabaria procurando o arquivo
 * numa URL de navegador. Quem separa os dois é `process.versions.node`, que
 * não existe no bundle do navegador.
 */
function caminhoDoWasm(arquivo: string): string {
  if (typeof process !== 'undefined' && process.versions?.node) {
    return `${process.cwd()}/node_modules/sql.js/dist/${arquivo}`
  }
  return `${import.meta.env.BASE_URL}${arquivo}`
}

export async function abrirBanco(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs({ locateFile: caminhoDoWasm })
  const salvo = await lerDoIndexedDB()

  db = salvo ? new SQL.Database(salvo) : new SQL.Database()
  db.run(SCHEMA)

  if (!salvo) {
    semear(db)
    await persistir()
  }

  return db
}

export function banco(): Database {
  if (!db) throw new Error('Banco não inicializado. Chame abrirBanco() antes.')
  return db
}

// ── Consulta ──────────────────────────────────────────────────────────

export function consultar<T>(sql: string, params: SqlValue[] = []): T[] {
  const stmt = banco().prepare(sql)
  stmt.bind(params)
  const linhas: T[] = []
  while (stmt.step()) linhas.push(stmt.getAsObject() as T)
  stmt.free()
  return linhas
}

export function consultarUm<T>(sql: string, params: SqlValue[] = []): T | null {
  return consultar<T>(sql, params)[0] ?? null
}

export function executar(sql: string, params: SqlValue[] = []): void {
  banco().run(sql, params)
}

// ── Persistência ──────────────────────────────────────────────────────

function abrirIndexedDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(NOME_IDB, 1)
    req.onupgradeneeded = () => req.result.createObjectStore('arquivos')
    req.onsuccess = () => resolve(req.result)
    req.onerror = () => reject(req.error)
  })
}

async function lerDoIndexedDB(): Promise<Uint8Array | null> {
  if (typeof indexedDB === 'undefined') return null
  try {
    const idb = await abrirIndexedDB()
    return await new Promise((resolve) => {
      const req = idb
        .transaction('arquivos', 'readonly')
        .objectStore('arquivos')
        .get(CHAVE_IDB)
      req.onsuccess = () =>
        resolve(req.result ? new Uint8Array(req.result as ArrayBuffer) : null)
      req.onerror = () => resolve(null)
    })
  } catch {
    return null
  }
}

export async function persistir(): Promise<void> {
  if (typeof indexedDB === 'undefined' || !db) return
  const bytes = db.export()
  try {
    const idb = await abrirIndexedDB()
    idb
      .transaction('arquivos', 'readwrite')
      .objectStore('arquivos')
      .put(bytes.buffer, CHAVE_IDB)
  } catch {
    // Persistência é conveniência: se o navegador recusar, o app segue
    // funcionando com o banco em memória.
  }
}

export async function resetarBanco(): Promise<void> {
  db?.close()
  db = null
  if (typeof indexedDB !== 'undefined') {
    await new Promise((resolve) => {
      const req = indexedDB.deleteDatabase(NOME_IDB)
      req.onsuccess = req.onerror = req.onblocked = () => resolve(null)
    })
  }
  await abrirBanco()
}

export function novoId(prefixo: string): string {
  return `${prefixo}-${Math.random().toString(36).slice(2, 9)}`
}

// ── Dados de exemplo ──────────────────────────────────────────────────

function iso(dias: number): string {
  const d = new Date()
  d.setUTCDate(d.getUTCDate() + dias)
  return d.toISOString()
}

function semear(base: Database): void {
  const itensTelhado: Array<[string, string, number]> = [
    ['im-1', 'Estrutura de apoio', 1],
    ['im-2', 'Calhas e rufos', 1],
    ['im-3', 'Telhas quebradas', 1],
    ['im-4', 'Vegetação sobre o telhado', 0],
  ]
  const itensFachada: Array<[string, string, number]> = [
    ['im-5', 'Revestimento', 1],
    ['im-6', 'Esquadrias', 0],
  ]

  base.run(
    `INSERT INTO cliente (id, nome, documento, cidade, criado_em) VALUES
       ('cli-1', 'Construtora Aurora', '12.345.678/0001-90', 'São Paulo', ?),
       ('cli-2', 'Condomínio Parque das Flores', '98.765.432/0001-10',
        'Campinas', ?)`,
    [iso(-40), iso(-15)],
  )

  base.run(
    `INSERT INTO modelo (id, nome, criado_em) VALUES
       ('mod-1', 'Telhado residencial', ?),
       ('mod-2', 'Fachada comercial', ?)`,
    [iso(-30), iso(-20)],
  )

  for (const [modeloId, itens] of [
    ['mod-1', itensTelhado],
    ['mod-2', itensFachada],
  ] as const) {
    itens.forEach(([id, descricao, obrigatorio], ordem) => {
      base.run(
        `INSERT INTO item_modelo (id, modelo_id, descricao, obrigatorio, ordem)
         VALUES (?, ?, ?, ?, ?)`,
        [id, modeloId, descricao, obrigatorio, ordem],
      )
    })
  }

  base.run(
    `INSERT INTO vistoria
       (id, cliente_id, modelo_id, status, agendada_para, concluida_em) VALUES
       ('vis-1', 'cli-1', 'mod-1', 'finalizada', ?, ?),
       ('vis-2', 'cli-2', 'mod-1', 'em_andamento', ?, NULL),
       ('vis-3', 'cli-1', 'mod-2', 'agendada', ?, NULL)`,
    [iso(-7), iso(-7), iso(-1), iso(3)],
  )

  // vis-1: finalizada, todos os obrigatórios com foto.
  itensTelhado.forEach(([itemModeloId, descricao, obrigatorio], i) => {
    base.run(
      `INSERT INTO item_vistoria (id, vistoria_id, item_modelo_id, descricao,
         obrigatorio, situacao, observacao, foto_url, ordem)
       VALUES (?, 'vis-1', ?, ?, ?, ?, ?, ?, ?)`,
      [
        `iv-${i + 1}`,
        itemModeloId,
        descricao,
        obrigatorio,
        i === 2 ? 'nao_conforme' : 'conforme',
        i === 2 ? 'Três telhas trincadas na água oeste.' : '',
        obrigatorio ? `/fotos/vis-1-${i + 1}.jpg` : null,
        i,
      ],
    )
  })

  // vis-2: em andamento, faltando foto em obrigatórios (DM-02).
  itensTelhado.forEach(([itemModeloId, descricao, obrigatorio], i) => {
    base.run(
      `INSERT INTO item_vistoria (id, vistoria_id, item_modelo_id, descricao,
         obrigatorio, situacao, observacao, foto_url, ordem)
       VALUES (?, 'vis-2', ?, ?, ?, ?, '', ?, ?)`,
      [
        `iv-1${i + 1}`,
        itemModeloId,
        descricao,
        obrigatorio,
        i === 0 ? 'conforme' : 'pendente',
        i === 0 ? '/fotos/vis-2-1.jpg' : null,
        i,
      ],
    )
  })

  // vis-3: agendada, nada preenchido.
  itensFachada.forEach(([itemModeloId, descricao, obrigatorio], i) => {
    base.run(
      `INSERT INTO item_vistoria (id, vistoria_id, item_modelo_id, descricao,
         obrigatorio, situacao, observacao, foto_url, ordem)
       VALUES (?, 'vis-3', ?, ?, ?, 'pendente', '', NULL, ?)`,
      [`iv-2${i + 1}`, itemModeloId, descricao, obrigatorio, i],
    )
  })
}

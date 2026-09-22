/**
 * Schema do banco. Mantido em um lugar só para que migração futura seja
 * diff legível — ver docs/DECISIONS.md.
 */
export const SCHEMA = `
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS cliente (
  id         TEXT PRIMARY KEY,
  nome       TEXT NOT NULL,
  documento  TEXT NOT NULL DEFAULT '',
  cidade     TEXT NOT NULL DEFAULT '',
  criado_em  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS modelo (
  id         TEXT PRIMARY KEY,
  nome       TEXT NOT NULL,
  criado_em  TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS item_modelo (
  id           TEXT PRIMARY KEY,
  modelo_id    TEXT NOT NULL REFERENCES modelo(id) ON DELETE CASCADE,
  descricao    TEXT NOT NULL,
  obrigatorio  INTEGER NOT NULL CHECK (obrigatorio IN (0, 1)),
  ordem        INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS vistoria (
  id             TEXT PRIMARY KEY,
  cliente_id     TEXT NOT NULL REFERENCES cliente(id),
  modelo_id      TEXT NOT NULL REFERENCES modelo(id),
  status         TEXT NOT NULL CHECK (
                   status IN ('agendada', 'em_andamento', 'finalizada')),
  agendada_para  TEXT NOT NULL,
  -- DM-03: data do dispositivo em campo, nunca a do servidor.
  concluida_em   TEXT
);

CREATE TABLE IF NOT EXISTS item_vistoria (
  id              TEXT PRIMARY KEY,
  vistoria_id     TEXT NOT NULL REFERENCES vistoria(id) ON DELETE CASCADE,
  item_modelo_id  TEXT NOT NULL,
  descricao       TEXT NOT NULL,
  obrigatorio     INTEGER NOT NULL CHECK (obrigatorio IN (0, 1)),
  situacao        TEXT NOT NULL CHECK (
                    situacao IN ('pendente', 'conforme', 'nao_conforme')),
  observacao      TEXT NOT NULL DEFAULT '',
  foto_url        TEXT,
  ordem           INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_item_modelo_modelo
  ON item_modelo(modelo_id);
CREATE INDEX IF NOT EXISTS idx_item_vistoria_vistoria
  ON item_vistoria(vistoria_id);
CREATE INDEX IF NOT EXISTS idx_vistoria_status
  ON vistoria(status);
`

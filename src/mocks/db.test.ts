import { describe, expect, it } from 'vitest'
import { abrirBanco, consultar, consultarUm, executar } from './db'

describe('banco SQLite', () => {
  it('cria o schema e carrega os dados de exemplo', async () => {
    await abrirBanco()
    const tabelas = consultar<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type = 'table' ORDER BY name",
    ).map((t) => t.name)

    expect(tabelas).toEqual([
      'cliente',
      'item_modelo',
      'item_vistoria',
      'modelo',
      'vistoria',
    ])
  })

  it('conta os obrigatórios de um modelo com SQL', async () => {
    await abrirBanco()
    const linha = consultarUm<{ total: number }>(
      `SELECT COUNT(*) AS total FROM item_modelo
        WHERE modelo_id = 'mod-1' AND obrigatorio = 1`,
    )
    expect(linha?.total).toBe(3)
  })

  it('DM-02: a vistoria em andamento tem obrigatório sem foto', async () => {
    await abrirBanco()
    const pendentes = consultar<{ descricao: string }>(
      `SELECT descricao FROM item_vistoria
        WHERE vistoria_id = 'vis-2' AND obrigatorio = 1 AND foto_url IS NULL
        ORDER BY ordem`,
    ).map((l) => l.descricao)

    expect(pendentes).toEqual(['Calhas e rufos', 'Telhas quebradas'])
  })

  it('o schema recusa status fora do domínio', async () => {
    await abrirBanco()
    expect(() =>
      executar(
        `INSERT INTO vistoria
           (id, cliente_id, modelo_id, status, agendada_para, concluida_em)
         VALUES ('vis-x', 'cli-1', 'mod-1', 'cancelada', '2026-01-01', NULL)`,
      ),
    ).toThrow(/CHECK constraint failed/)
  })

  it('não deixa vistoria órfã de cliente', async () => {
    await abrirBanco()
    expect(() =>
      executar(
        `INSERT INTO vistoria
           (id, cliente_id, modelo_id, status, agendada_para, concluida_em)
         VALUES ('vis-y', 'cli-inexistente', 'mod-1', 'agendada',
                 '2026-01-01', NULL)`,
      ),
    ).toThrow(/FOREIGN KEY constraint failed/)
  })
})

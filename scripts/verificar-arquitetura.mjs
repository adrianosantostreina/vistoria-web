/**
 * Guarda determinística da AR-02: componentes não chamam API.
 *
 * O tsc e o linter não pegam isso — um componente que faz fetch é código
 * perfeitamente válido. A regra existe no RULES.md, mas instrução depende de
 * o agente lembrar. Este script transforma a regra em verificação.
 *
 * Uso: node scripts/verificar-arquitetura.mjs
 * Sai com código 1 quando encontra violação.
 */
import { readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'

const PASTA = 'src/components'

const PROIBIDO = [
  { padrao: /\bfetch\s*\(/, motivo: 'chamada de API direta (AR-02)' },
  { padrao: /from\s+['"].*services\//, motivo: 'import de services/ (AR-02)' },
  { padrao: /useQuery|useMutation/, motivo: 'estado de servidor no componente (AR-02)' },
]

function arquivos(pasta) {
  return readdirSync(pasta).flatMap((nome) => {
    const caminho = join(pasta, nome)
    if (statSync(caminho).isDirectory()) return arquivos(caminho)
    return /\.tsx?$/.test(nome) && !/\.test\./.test(nome) ? [caminho] : []
  })
}

const violacoes = []

for (const caminho of arquivos(PASTA)) {
  const linhas = readFileSync(caminho, 'utf8').split('\n')
  linhas.forEach((linha, i) => {
    for (const { padrao, motivo } of PROIBIDO) {
      if (padrao.test(linha)) {
        violacoes.push(`${caminho}:${i + 1}  ${motivo}`)
      }
    }
  })
}

if (violacoes.length > 0) {
  console.error('AR-02 violada — componentes nao chamam API:\n')
  for (const v of violacoes) console.error('  ' + v)
  console.error('\nDados entram por props ou por hook de features/.')
  process.exit(1)
}

console.log('AR-02 ok — nenhum componente acessa dados diretamente.')

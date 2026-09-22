/**
 * Copia o binário do SQLite (WebAssembly) para public/, de onde o navegador
 * vai baixá-lo em tempo de execução.
 *
 * Existe por um detalhe fácil de perder: o sql.js publica duas variantes. No
 * Node, o pacote resolve para sql-wasm.js, que pede `sql-wasm.wasm`. No
 * navegador, a condição "browser" do package.json resolve para
 * sql-wasm-browser.js, que pede `sql-wasm-browser.wasm` — outro nome.
 * Copiar o arquivo errado produz um erro que só aparece no build de produção:
 * o servidor devolve o HTML da página no lugar do binário, e o navegador
 * reclama de "magic word" inválida.
 *
 * O binário não é versionado: este passo roda antes de `dev` e de `build`.
 */
import { copyFileSync, existsSync, mkdirSync } from 'node:fs'

const ORIGEM = 'node_modules/sql.js/dist/sql-wasm-browser.wasm'
const DESTINO = 'public/sql-wasm-browser.wasm'

if (!existsSync(ORIGEM)) {
  console.error(`Nao encontrei ${ORIGEM}. Rode npm install antes.`)
  process.exit(1)
}

mkdirSync('public', { recursive: true })
copyFileSync(ORIGEM, DESTINO)
console.log(`SQLite (wasm) pronto em ${DESTINO}`)

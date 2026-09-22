/**
 * O GitHub Pages serve arquivos estaticos: uma rota como /vistoria-web/clientes
 * nao existe em disco e devolveria 404. Copiar o index.html para 404.html faz
 * o Pages devolver a aplicacao, e o roteador assume dali.
 */
import { copyFileSync } from 'node:fs'

copyFileSync('dist/index.html', 'dist/404.html')
console.log('404.html gerado a partir do index.html')

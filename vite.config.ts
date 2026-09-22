import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// O site publicado fica em <usuario>.github.io/vistoria-web/, por isso o base.
export default defineConfig({
  base: process.env.BASE_PATH ?? '/vistoria-web/',
  plugins: [react(), tailwindcss()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    globals: true,
    css: false,
  },
})

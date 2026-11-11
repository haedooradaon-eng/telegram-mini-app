import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base so the built files work from any sub-path
// (e.g. a GitHub Pages project site) without absolute URLs.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    // The bot picture + three picture options are intentionally inlined
    // as data URIs so the `set_botpic` sendData payload
    // stays byte-identical — that alone is ~2 MB of JS.
    chunkSizeWarningLimit: 3000,
  },
})

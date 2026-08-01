import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import preact from '@preact/preset-vite'

const CONTENT_FOLDER = /[\\/]src[\\/]data[\\/]([^\\/]+)[\\/]/

export default defineConfig({
  plugins: [
    tailwindcss(),
    preact()
  ],
  base: '/lotm_wiki/',
  assetsInclude: ['**/*.md'],
  build: {
    rollupOptions: {
      output: {
        // `import.meta.glob` gives every markdown file its own dynamic import,
        // which Rollup would otherwise emit as one ~1 kB chunk per entry —
        // hundreds of requests to open a single category. Group each category
        // folder into one chunk so a category costs one request and caches as
        // a unit.
        manualChunks(id) {
          const match = id.match(CONTENT_FOLDER)
          return match ? `content-${match[1]}` : undefined
        }
      }
    }
  }
})

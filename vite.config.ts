import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'

export default defineConfig(({ mode }) => ({
  plugins: [
    build({
      outputDir: './dist',
      minify: mode === 'production',
      external: [],
      emptyOutDir: false
    }),
    devServer({
      adapter,
      entry: 'src/index.tsx'
    }),
    {
      name: 'generate-routes',
      closeBundle() {
        const fs = require('fs')
        const path = require('path')
        const routesPath = path.join(__dirname, 'dist', '_routes.json')
        const routes = {
          version: 1,
          include: ['/*'],
          exclude: [
            '/static/*',
            '/favicon.ico',
            '/favicon-192.png',
            '/favicon-512.png',
            '/apple-touch-icon.png',
            '/manifest.json',
            '/og-image.png',
            '/og-image-square.png'
          ]
        }
        fs.writeFileSync(routesPath, JSON.stringify(routes, null, 2))
      }
    }
  ]
}))

import build from '@hono/vite-build/cloudflare-pages'
import devServer from '@hono/vite-dev-server'
import adapter from '@hono/vite-dev-server/cloudflare'
import { defineConfig } from 'vite'
import { writeFileSync } from 'fs'
import { join } from 'path'

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
        const routesPath = join(process.cwd(), 'dist', '_routes.json')
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
            '/og-image.webp',
            '/og-image-square.png',
            '/og-image-square.webp',
            '/og-image-dark.png',
            '/og-image-dark.webp',
            '/og-image-square-dark.png',
            '/og-image-square-dark.webp',
            '/robots.txt'
          ]
        }
        writeFileSync(routesPath, JSON.stringify(routes, null, 2))
      }
    }
  ]
}))

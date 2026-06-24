import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  // Build the SPA into the repo-root ./public dir. On Vercel this is served
  // straight from the CDN; the Flask function handles the API routes.
  build: {
    outDir: '../public',
    emptyOutDir: true,
  },
  // In dev, proxy the API routes to the Flask backend (python ./index.py -> :5000)
  // so `npm run dev` works end-to-end against the local API.
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/rates': 'http://localhost:5000',
      '/convert': 'http://localhost:5000',
      '/history': 'http://localhost:5000',
    },
  },
})

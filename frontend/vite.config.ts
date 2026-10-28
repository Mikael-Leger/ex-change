import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Node types are not installed for this small config; only the env is read.
declare const process: { env: Record<string, string | undefined> }

// In dev, the API routes are proxied to the Flask backend (python ./index.py -> :5000).
// API_PROXY points them elsewhere, e.g. at a deployed copy when no API key is at hand.
const api = process.env.API_PROXY || 'http://localhost:5000'
const route = { target: api, changeOrigin: true }

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/',
  server: {
    proxy: {
      '/api': route,
      '/rates': route,
      '/convert': route,
      '/history': route,
    },
  },
})

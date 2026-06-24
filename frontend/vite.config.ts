import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/static/',
  // In dev, proxy the API routes to the Flask backend (python ./index.py -> :5000)
  // so `npm run dev` works end-to-end without building into Flask's static dir.
  server: {
    proxy: {
      '/api': 'http://localhost:5000',
      '/rates': 'http://localhost:5000',
      '/convert': 'http://localhost:5000',
      '/history': 'http://localhost:5000',
    },
  },
})

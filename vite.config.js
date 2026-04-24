import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/health': 'http://127.0.0.1:8000',
      '/automations': 'http://127.0.0.1:8000',
      '/validate': 'http://127.0.0.1:8000',
      '/explain': 'http://127.0.0.1:8000',
      '/simulate': 'http://127.0.0.1:8000',
      '/score': 'http://127.0.0.1:8000',
      '/brief': 'http://127.0.0.1:8000',
    },
  },
})

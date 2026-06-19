import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/auth': {
        target: 'http://127.0.0.1:8081',
        changeOrigin: true
      },
      '/api/usuarios': {
        target: 'http://127.0.0.1:8082',
        changeOrigin: true
      },
      '/necesidades': {
        target: 'http://127.0.0.1:8083',
        changeOrigin: true
      },
      '/stock': {
        target: 'http://127.0.0.1:8084',
        changeOrigin: true
      },
      '/api/match': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true
      }
    }
  }
})

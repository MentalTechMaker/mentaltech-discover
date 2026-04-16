import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd() + '/..', 'FRONTEND_URL');
  return {
  plugins: [react()],
  define: {
    'import.meta.env.VITE_SITE_URL': JSON.stringify(env.FRONTEND_URL || 'http://localhost:3033'),
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
    },
  },
}})

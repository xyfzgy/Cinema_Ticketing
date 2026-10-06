import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:9090',
      '/movie': 'http://localhost:9090',
      '/cinema': 'http://localhost:9090',
      '/hall': 'http://localhost:9090',
      '/screening': 'http://localhost:9090',
      '/order': 'http://localhost:9090',
      '/payment': 'http://localhost:9090',
      '/refund': 'http://localhost:9090',
      '/ticket': 'http://localhost:9090',
      '/admin': 'http://localhost:9090',
      '/ai': 'http://localhost:9090',
    },
  },
})

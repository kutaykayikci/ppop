import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/ppop/', // GitHub Pages için repository path
  plugins: [
    react()
  ],
  build: {
    outDir: 'dist',
    sourcemap: false, // Production'da sourcemap'i kapat
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Console.log'ları production'da kaldır
        drop_debugger: true
      }
    }
  }
})

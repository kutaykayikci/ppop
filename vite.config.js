import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { fileURLToPath, URL } from 'node:url'

const analyzer = process.env.ANALYZE === 'true'

export default defineConfig({
  plugins: [
    react(),
    ...(analyzer ? [visualizer({ filename: 'dist/bundle-analysis.html', open: true, gzipSize: true, brotliSize: true })] : [])
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  // PWA ve Service Worker için
  define: {
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production')
  },
  build: {
    outDir: 'dist',
    // Minification ve optimizasyon
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    // Tree shaking ve MIME type sorunları için
    rollupOptions: {
      output: {
        // JavaScript modülleri için doğru MIME type
        format: 'es',
        manualChunks: {
          // Vendor chunk'ları ayır
          vendor: ['react', 'react-dom'],
          firebase: ['firebase/app', 'firebase/firestore', 'firebase/auth'],
          utils: ['date-fns']
        },
        // Asset dosyaları için optimizasyon - Cache busting için hash
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.')
          const ext = info[info.length - 1]
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash][extname]`
          }
          if (/woff2?|eot|ttf|otf/i.test(ext)) {
            return `assets/fonts/[name]-[hash][extname]`
          }
          return `assets/[name]-[hash][extname]`
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js'
      }
    },
    // Bundle boyut uyarıları
    chunkSizeWarningLimit: 1000,
    // Source map sadece development'ta
    sourcemap: false,
    // CSS code splitting
    cssCodeSplit: true,
    // Asset inline threshold (1kb altındaki dosyalar inline olur)
    assetsInlineLimit: 1024,
    // Cache busting için timestamp ekle
    assetsDir: 'assets',
    emptyOutDir: true
  },
  // Development optimizasyonları
  server: {
    hmr: {
      overlay: false
    }
  },
  // Dependency optimizasyonu
  optimizeDeps: {
    include: ['react', 'react-dom'],
    exclude: ['@firebase/app']
  }
})
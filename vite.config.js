import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/ppop/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        navigateFallback: '/ppop/index.html',
        navigateFallbackDenylist: [/^\/api\//]
      },
      includeAssets: ['poop-emoji.svg'],
      manifest: {
        name: 'Poop Count - Sevgililer Takibi',
        short_name: 'PoopCount',
        description: 'Sevgilinizle eğlenceli tuvalet takip uygulaması',
        theme_color: '#ff6b6b',
        background_color: '#ffffff',
        display: 'standalone',
        scope: '/ppop/',
        start_url: '/ppop/',
        icons: [
          {
            src: 'poop-emoji.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    }
  }
})

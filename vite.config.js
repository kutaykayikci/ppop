import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Poop Count - Sevgililer Takibi',
        short_name: 'PoopCount',
        description: 'Sevgilinizle eğlenceli tuvalet takip uygulaması',
        theme_color: '#ff6b6b',
        background_color: '#ffffff',
        display: 'standalone',
        icons: [
          {
            src: 'poop-emoji.svg',
            sizes: 'any',
            type: 'image/svg+xml'
          }
        ]
      }
    })
  ]
})

import path from 'path'
import { fileURLToPath } from 'url' // <-- Mana shu import yetishmayotgan edi
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// Zamonaviy ES Modules muhitida __dirname ni aniqlash
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    // id parametriga string tipi berildi, xatolik yo'qoladi
    resolveId(id: string) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  // Netlify va lokal muhit uchun asosiy yo'nalish
  base: '/', 
  
  plugins: [
    figmaAssetResolver(),
    // React va Tailwind plaginlari Figma Make ishlashi uchun zarur
    react(),
    tailwindcss(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  // Fayllarni build jarayonida Netlify to'g'ri topishi uchun asset papkasiga joylash
  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]',
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
      },
    },
  },

  // Qo'shimcha formatlarni qo'llab-quvvatlash
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
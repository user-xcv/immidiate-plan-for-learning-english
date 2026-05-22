import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',






   
  }
}

export default defineConfig({
  // Netlify uchun asosiy yo'nalish (root) doimo '/' bo'lishi shart
  base: '/', 
  
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
 

  // Fayllarni build jarayonida to'g'ri asset papkasiga joylashini ta'minlash
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

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})
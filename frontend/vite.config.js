import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Don't expose source maps in production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  },
  server: {
    host: 'localhost', // Security: Don't expose to network
    port: 3000
  },
  preview: {
    host: 'localhost', // Security: Don't expose to network
    port: 3000
  }
})

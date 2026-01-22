import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
       proxy: {
      "/api": {
        target: "https://contractional-napoleon-superblessed.ngrok-free.dev",
        secure: false,
        changeOrigin: true,
        ws:true,
        rewrite: path => path.replace(/^\/api/, '')
      }
    },
    open: true,
    port: 5173,
    host: "0.0.0.0"
  }
})
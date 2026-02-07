import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
     proxy: {
      "/api": {
        target: "https://20.193.149.193",
        changeOrigin: true,
        secure: false,
      },},
    open: true,
    port: 5173,
    host: "0.0.0.0"
  }
})
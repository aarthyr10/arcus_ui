import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    allowedHosts: ["arcus.tarkasha.com"],
    proxy: {
      "/api": {
        //target: "http://localhost:8000",
        //target: "https://robbi-ungouty-babette.ngrok-free.dev",
        //target: "https://20.193.149.193",
        target: "https://arcus.tarkasha.com",
        changeOrigin: true,
        secure: false,
      },},
    open: true,
    port: 5173,
    host: true
  }
  
})
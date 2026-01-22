import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(),
    tailwindcss()
  ],
  server: {
    //    proxy: {
    //   "/api": {
    //     target: "https://contractional-napoleon-superblessed.ngrok-free.dev/api/v1",
    //     secure: false,
    //     changeOrigin: true,
    //     ws:true,
    //     rewrite: path => path.replace(/^\/api/, '')
    //   }
    // },
    //  proxy: {
    //   "/api": {
    //     target: "https://contractional-napoleon-superblessed.ngrok-free.dev",
    //     changeOrigin: true,
    //     secure: false,
    //   },
    // },
     proxy: {
      "/api": {  // Proxy all /api/* requests
        target: "https://contractional-napoleon-superblessed.ngrok-free.dev",
        changeOrigin: true,
        secure: false,
      },},
    //  proxy: {
    //   "/api": {
    //     target: "http://localhost:3000",  // Replace 3000 with your backend's port
    //     changeOrigin: true,
    //   },
    // },
    open: true,
    port: 5173,
    host: "0.0.0.0"
  }
})
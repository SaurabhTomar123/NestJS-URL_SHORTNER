import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    port: 5173,
    proxy: {
      "/short-url": "http://localhost:3000",
      "/analytics": "http://localhost:3000",
      "/:shortid": "http://localhost:3000"
    }
  }
})

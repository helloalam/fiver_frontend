import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [ react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://fiverr-backend-54ww.onrender.com', // Your Express backend
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

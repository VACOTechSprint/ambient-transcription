import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'https://vaco-frontend-app-bucket.storage.googleapis.com/',
  plugins: [react()],
})

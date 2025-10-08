import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/sport-pwa/', // <- nom EXACT du repo GitHub
})

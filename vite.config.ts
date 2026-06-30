// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * @TODO_REAL_PROJECT: Vite configuration with development proxy settings 
 * to route API requests to the local backend server (port 3001).
 * * PUBLIC DEMO VERSION: Proxy settings disabled to prevent exposure of 
 * internal API structures and backend environment architecture.
 */
export default defineConfig({
  plugins: [react()],
  server: {
    // Il proxy è stato disabilitato per la versione pubblica 
    // per proteggere l'architettura dei tuoi endpoint di backend.
    proxy: {} 
  }
})
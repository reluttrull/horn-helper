import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
//import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

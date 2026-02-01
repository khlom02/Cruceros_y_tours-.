import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: [
      '6u4mmv-ip-179-60-64-236.tunnelmole.net',
      'szuota-ip-179-60-64-236.tunnelmole.net',
    ],
  },
  resolve: {
    alias: {
      react: 'react',
    },
  },
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: true,
  },
  resolve: {
    alias: {
      react: 'react',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'supabase': ['@supabase/supabase-js', '@supabase/auth-ui-react'],
          'ui': ['react-bootstrap', '@fortawesome/react-fontawesome', 'react-icons'],
          'animation': ['gsap', 'animate.css'],
        },
      },
    },
    chunkSizeWarningLimit: 1024,
  },
})

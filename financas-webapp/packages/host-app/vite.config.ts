import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    server: { 
    port: 3000,
    strictPort: true
   },
   preview: { 
    port: 3000,
    strictPort: true,
    cors: true 
  },
  plugins: [
    react(),
    federation({
      name: 'host_app',
      remotes: {
        mfe_auth: 'http://localhost:3001/assets/remoteEntry.js',
        mfe_transactions: 'http://localhost:3002/assets/remoteEntry.js',
        mfe_dashboard: 'http://localhost:3003/assets/remoteEntry.js',
      },
      shared: ['react', 'react-dom']
    })
  ],
  build: { 
    target: 'esnext',
    minify: false,
    cssCodeSplit: false
  }
});
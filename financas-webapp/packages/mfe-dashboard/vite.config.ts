import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
    server: { 
    port: 3003,
    strictPort: true
   },
   preview: { 
    port: 3003,
    strictPort: true,
    cors: true 
  },
  plugins: [
    react(),
    federation({
      name: 'mfe_dashboard',
      filename: 'remoteEntry.js',
      exposes: {
        './Dashboard': './src/App.tsx',
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
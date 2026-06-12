import federation from '@originjs/vite-plugin-federation';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  server: { 
    port: 3001,
    strictPort: true
   },
   preview: { 
    port: 3001,
    strictPort: true,
    cors: true 
  },
  plugins: [
    react(),
    federation({
      name: 'mfe_auth',
      filename: 'remoteEntry.js',
      exposes: {
        './AuthRoutes': './src/App.tsx',
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

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import process from 'process';
import path from 'path';


export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    chunkSizeWarningLimit: 7000,
  },
  resolve: {
    alias: {
      "@": path.resolve(process.cwd(), "./src"),
      "@redux": path.resolve(process.cwd(), "./src/redux"),
      "@lib": path.resolve(process.cwd(), "./src/lib"),
      "@public": path.resolve(process.cwd(), "./public"),
    },
  },
});
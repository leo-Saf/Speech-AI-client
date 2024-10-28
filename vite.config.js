import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Gör servern tillgänglig externt
    port: 5173,      // Den port Vite använder, mappad till 8080 i Docker Compose
  },
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  optimizeDeps: {
    include: [
      'leaflet',
      'leaflet-routing-machine',
      'leaflet-control-geocoder'
    ]
  },
  build: {
    commonjsOptions: {
      include: [/leaflet-routing-machine/, /node_modules/]
    }
  },
  server: {
    proxy: {
      '/socket.io': {
        target: `http://localhost:3000`,
        ws: true
      }
    }
  }
});

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
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
  }
});

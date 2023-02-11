import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {VitePWA} from 'vite-plugin-pwa';
import mkcert from 'vite-plugin-mkcert';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    mkcert(),
    VitePWA({
      registerType: 'prompt',
      devOptions: {
        enabled: process.env.VITE_APP_ENVIRONMENT === 'dev' ? true : false,
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,png,svg,webp,jpg,jpeg}'],
      },
      includeAssets: ['icon.png'],
      manifest: {
        name: 'Albedo Wallpaper Cropper',
        short_name: 'Agadêmicos Cropper',
        description: 'Crop and collect wallpapers for Albedo Theme',
        theme_color: '#FBBF24',
        background_color: '#121212',
        icons: [
          {
            src: 'icon.png',
            sizes: '192x192',
            type: 'image/png',
          }
        ],
      },
    })],
});

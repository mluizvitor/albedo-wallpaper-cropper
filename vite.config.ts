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
        short_name: 'Albedo Cropper',
        description: 'Crop and collect wallpapers for Albedo ES Theme',
        theme_color: '#FBBF24',
        background_color: '#121212',
        icons: [
          {
            src: 'icon_48.png',
            sizes: '48x48',
            type: 'image/png',
          },
          {
            src: 'icon_64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'icon_128.png',
            sizes: '128x128',
            type: 'image/png',
          },
          {
            src: 'icon_256.png',
            sizes: '256x256',
            type: 'image/png',
          }
        ],
      },
    })],
});

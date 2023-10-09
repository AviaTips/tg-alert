import { defineConfig } from 'vite';

import VueI18nPlugin from '@intlify/unplugin-vue-i18n/vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/app/',
  server: {
    open: true,
    proxy: {
      '/api': 'http://127.0.0.1:3000',
    },
  },
  plugins: [
    vue(),
    VueI18nPlugin({
      include: ['./src/locales/**'],
    }),
  ],
});

import { defineConfig } from 'vite';

export default defineConfig({
  preview: {
    port: process.env.PORT || 3003,
  },
});

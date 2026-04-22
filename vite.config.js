// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['gsap', 'lenis', 'framer-motion'],
  },
});

// ─────────────────────────────────────────────────────────
// postcss.config.js  (save as a SEPARATE file)
// ─────────────────────────────────────────────────────────
// export default {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//   },
// };
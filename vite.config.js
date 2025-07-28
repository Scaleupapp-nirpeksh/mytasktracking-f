import { defineConfig } from 'vite';

export default defineConfig({
  esbuild: {
    loader: 'jsx',  // Treat all files as JSX (including .js files)
  },
});

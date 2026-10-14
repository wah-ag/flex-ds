import { defineConfig } from 'tsup';

// The library build. CSS is built separately by scripts/build-css.mjs: the
// components import none, so nothing here touches styles.
export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
  external: ['react', 'react-dom'],
  outDir: 'dist',
});

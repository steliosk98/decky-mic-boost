import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: "src/index.tsx",
      // Decky Loader currently loads the bundled file in a CommonJS context,
      // so we emit a CJS bundle instead of a bare ES module to avoid
      // "Cannot use import statement outside a module" at runtime.
      formats: ["cjs"],
      fileName: () => "index.js",
    },
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      external: ["decky-frontend-lib"],
    },
  },
});

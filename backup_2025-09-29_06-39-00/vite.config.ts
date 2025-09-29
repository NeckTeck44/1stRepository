import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  // Plugins pour le support CSS et hot reload
  plugins: [],

  // Configuration pour servir des fichiers statiques
  root: __dirname,
  publicDir: ".",
  base: "/",

  // Activer la transformation CSS
  esbuild: {
    loader: "css",
  },

  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "index.html"),
    },
  },

  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: false,
    // Servir les fichiers statiques directement
    fs: {
      strict: false,
      allow: [".."],
    },
    // Activer le HMR pour le hot reload des modifications
    hmr: {
      port: 5173,
    },
    watch: {
      usePolling: true,
      interval: 100,
    },
  },

  // Optimiser les dépendances CSS
  optimizeDeps: {
    include: [],
  },

  // Configuration CSS
  css: {
    devSourcemap: true,
  },
});

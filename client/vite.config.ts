export default {
  root: ".",
  publicDir: "public",
  base: "/",
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
  server: {
    port: 5173,
    strictPort: true,
    host: true,
    open: false,
    fs: {
      strict: false,
    },
  },
};

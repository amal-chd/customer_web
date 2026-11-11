import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        // Firebase and framer-motion change far less often than the app, so
        // their own files stay cached across deploys and download in parallel.
        // Both are ES modules. Never split React out this way: it is CommonJS,
        // and isolating it blanked production on 2026-10-03.
        manualChunks(id) {
          if (/node_modules\/(firebase|@firebase)\//.test(id)) return "firebase";
          if (/node_modules\/(framer-motion|motion-dom|motion-utils)\//.test(id)) return "motion";
        },
      },
    },
  },
  server: {
    port: 8090,
    host: true,
  },
});

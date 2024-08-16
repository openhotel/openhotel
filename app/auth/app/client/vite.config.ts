import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";

export default defineConfig({
  server: {
    port: 2024,
    proxy: {
      "/api": "http://localhost:20240",
    },
  },
  plugins: [react(), reactRefresh()],
  root: "./src",
  base: "/",
  publicDir: "assets",
  build: {
    outDir: "../build",
    emptyOutDir: true, // also necessary
  },
  resolve: {
    alias: {
      modules: "/modules",
      shared: "/shared",
    },
  },
});

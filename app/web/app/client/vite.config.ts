import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";

const PROXY_URL = "http://127.0.0.1:20250";

export default defineConfig({
  clearScreen: false,
  server: {
    port: 2025,
    proxy: {
      "/api": PROXY_URL,
    },
    fs: { allow: [fileURLToPath(new URL("../../..", import.meta.url))] },
  },
  plugins: [react(), tailwindcss()],
  root: "./src",
  base: "/",
  publicDir: "assets",
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      modules: "/modules",
      shared: "/shared",
      "@shared": fileURLToPath(new URL("../../../shared/src", import.meta.url)),
      "@openhotel/styles": "../node_modules/@openhotel/web-components/",
    },
  },
});

import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

const PROXY_URL =
  process.platform === "win32"
    ? "http://127.0.0.1:20250"
    : "http://localhost:20250";

export default defineConfig({
  clearScreen: false,
  server: {
    port: 2025,
    proxy: {
      "/api": PROXY_URL,
    },
    fs: { allow: [fileURLToPath(new URL("../../..", import.meta.url))] },
  },
  plugins: [react(), reactRefresh()],
  root: "./src",
  base: "/",
  publicDir: "assets",
  build: {
    outDir: "../build",
    emptyOutDir: true,
  },
  resolve: {
    alias: {
      modules: "/modules",
      shared: "/shared",
      "@shared": fileURLToPath(new URL("../../../shared/src", import.meta.url)),
      "@openhotel/styles": "../node_modules/@openhotel/web-components/",
    },
  },
});

import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

const PROXY_URL =
  process.platform === "win32"
    ? "http://127.0.0.1:20300"
    : "http://localhost:20300";

export default defineConfig({
  server: {
    port: 2030,
    proxy: {
      "/api": PROXY_URL,
    },
  },
  plugins: [react(), reactRefresh(), viteSingleFile()],
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
      "@oh/styles": "../node_modules/@oh/components/",
    },
  },
  define: {
    //@ts-ignore
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

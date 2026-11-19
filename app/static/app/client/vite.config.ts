import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";
import { fileURLToPath } from "node:url";

export default defineConfig({
  server: {
    port: 1995,
    proxy: {
      "^/[0-7][0-9A-HJKMNP-TV-Z]{25}$": "http://localhost:19950",
      "/api": "http://localhost:19950",
    },
    fs: { allow: [fileURLToPath(new URL("../../..", import.meta.url))] },
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
    dedupe: ["react", "react-dom"],
    alias: {
      modules: "/modules",
      shared: "/shared",
      "@shared": fileURLToPath(new URL("../../../shared/src", import.meta.url)),
      "@oh/styles": "../node_modules/@oh/components/",
    },
  },
  define: {
    //@ts-ignore
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

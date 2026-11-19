import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";

export default defineConfig({
  server: {
    port: 2030,
    proxy: {
      "/api": "http://127.0.0.1:20300",
    },
    fs: { allow: [fileURLToPath(new URL("../../..", import.meta.url))] },
  },
  plugins: [react()],
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
      "@openhotel/styles": "../node_modules/@openhotel/web-components",
    },
  },
  define: {
    //@ts-ignore
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

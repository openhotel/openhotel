import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  server: {
    port: 2030,
    proxy: {
      "/api": "http://localhost:20300",
    },
  },
  plugins: [react(), reactRefresh(), viteSingleFile()],
  root: "./src",
  base: "/",
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
  define: {
    //@ts-ignore
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin } from "@tulib/vite-tulip-plugin";
import { build } from "./vite/index.ts";

export default defineConfig({
  clearScreen: false,
  server: {
    port: 1994,
    proxy: {
      "/data": "http://localhost:19940",
      "/request": "http://localhost:19940",
      "/version": "http://localhost:19940",
      "/config": "http://localhost:19940",
      "/proxy": {
        target: "http://localhost:19940",
        ws: true,
      },
      "/auth": {
        target: "http://localhost:19940",
      },
    },
  },
  plugins: [tsconfigPaths(), plugin(), build()],
  publicDir: "assets/",
  build: {
    outDir: "./build",
    emptyOutDir: true, // also necessary
  },
  define: {
    //@ts-ignore
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

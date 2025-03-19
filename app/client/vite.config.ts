import { defineConfig } from "vite";
import reactRefresh from "@vitejs/plugin-react-refresh";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { build } from "./vite";

// https://github.com/openhotel/openhotel/issues/469
const PROXY_URL =
  process.platform === "win32"
    ? "http://127.0.0.1:19940"
    : "http://localhost:19940";

const getHash = () => Math.floor(Math.random() * 90000) + 10000;

export default defineConfig({
  clearScreen: false,
  server: {
    port: 1994,
    proxy: {
      "/data": PROXY_URL,
      "/request": PROXY_URL,
      "/info": PROXY_URL,
      "/changelog": PROXY_URL,
      "/proxy": {
        target: PROXY_URL,
        ws: true,
      },
      "/auth": PROXY_URL,
      //
      "/icon": PROXY_URL,
      "/background": PROXY_URL,
    },
    hmr: true,
  },
  plugins: [react(), reactRefresh(), tsconfigPaths(), build()],
  root: "./src",
  base: "/",
  publicDir: "./assets/",
  build: {
    outDir: "../../../build/client",
    emptyOutDir: false, // also necessary
    rollupOptions: {
      output: {
        entryFileNames: `[name]${getHash()}.js`,
        chunkFileNames: `[name]${getHash()}.js`,
        assetFileNames: `[name]${getHash()}.js`,
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: "modern",
      },
    },
  },
  define: {
    __APP_VERSION: `{ "version": "__VERSION__" }`,
  },
});

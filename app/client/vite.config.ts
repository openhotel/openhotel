import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin } from "@tulib/vite-tulip-plugin";
import { build } from "./vite/index.ts";

// https://github.com/openhotel/openhotel/issues/469
const PROXY_URL =
  process.platform === "win32"
    ? "http://127.0.0.1:19940"
    : "http://localhost:19940";

export default defineConfig({
  clearScreen: false,
  server: {
    port: 1994,
    proxy: {
      "/data": PROXY_URL,
      "/request": PROXY_URL,
      "/info": PROXY_URL,
      "/proxy": {
        target: PROXY_URL,
        ws: true,
      },
      "/auth": PROXY_URL,
      //
      "/icon": PROXY_URL,
      "/background": PROXY_URL,
    },
  },
  plugins: [tsconfigPaths(), plugin(), build()],
  publicDir: "assets/",
  build: {
    outDir: "../../build/client",
    emptyOutDir: false, // also necessary
  },
  define: {
    __APP_VERSION: `{ "version": "__VERSION__" }`,
  },
});

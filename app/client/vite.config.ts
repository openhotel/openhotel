import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { plugin } from "@tulib/vite-tulip-plugin";

export default defineConfig({
  server: {
    port: 1994,
    open: true,
  },
  plugins: [tsconfigPaths(), plugin()],
  publicDir: "assets",
  build: {
    outDir: "./build",
    emptyOutDir: true, // also necessary
  },
  define: {
    //@ts-ignore
    __APP_VERSION: JSON.stringify(process.env.npm_package_version),
  },
});

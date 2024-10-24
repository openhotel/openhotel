// vite.config.ts

import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import dts from "vite-plugin-dts";

export default defineConfig({
  plugins: [
    react(),
    dts({
      insertTypesEntry: true, // Generates a types entry file
    }),
  ],
  build: {
    lib: {
      entry: "./src/index.ts",
      fileName: (format) => `index.${format}.js`, // Output file name
      formats: ["es"], // Supported formats
    },
    rollupOptions: {
      external: ["react", "react-dom"], // Exclude peer dependencies
      output: {
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
        },
      },
    },
  },
});

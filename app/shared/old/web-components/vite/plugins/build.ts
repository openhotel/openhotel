import { Plugin } from "vite";
import fs from "fs";
import path from "path";

async function copyDirectory(src, dest) {
  await fs.promises.mkdir(dest, { recursive: true }); // Ensure the destination directory exists

  const entries = await fs.promises.readdir(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath); // Recursively copy subdirectory
    } else {
      await fs.promises.copyFile(srcPath, destPath); // Copy file
    }
  }
}

export const build = (): Plugin => ({
  name: "build",
  apply: "build",
  closeBundle: async () => {
    console.log("Running build script...");
    //Copy styles to dist folder
    await copyDirectory("./src/styles", "./dist/styles");
  },
});

import { Plugin } from "vite";
import { writeContributors } from "../utils/index.ts";
import { copyFile } from "fs/promises";

export const build = (): Plugin => ({
  name: "build",
  apply: "build",
  closeBundle: async () => {
    console.log("Running build script...");
    await writeContributors("../../build/client/contributors.yml");

    // Changelog
    await copyFile("../../CHANGELOG.md", "../../build/client/CHANGELOG.md");
  },
});

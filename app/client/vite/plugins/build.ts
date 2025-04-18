import { Plugin } from "vite";
import { writeContributors } from "../utils";

export const build = (): Plugin => ({
  name: "build",
  apply: "build",
  closeBundle: async () => {
    console.log("Running build script...");
    await writeContributors("../../build/client/contributors.yml");
  },
});

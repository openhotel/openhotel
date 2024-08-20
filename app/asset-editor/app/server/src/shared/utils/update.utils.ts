import { getPath } from "./path.utils.ts";
import * as path from "deno/path/mod.ts";

export const getTemporalUpdateFilePathname = () => {
  const dirPath = getPath();

  return path.join(dirPath, "./updater.sh");
};

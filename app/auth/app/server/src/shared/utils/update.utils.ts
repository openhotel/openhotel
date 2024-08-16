import { getPath } from "./path.utils.ts";
import { getOS } from "./os.utils.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";

export const getTemporalUpdateFilePathname = () => {
  const dirPath = getPath();
  const isWindows = getOS() === OS.WINDOWS;

  return path.join(dirPath, "./updater") + (isWindows ? ".ps1" : ".sh");
};

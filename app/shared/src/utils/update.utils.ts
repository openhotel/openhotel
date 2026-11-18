import { getPath } from "./path.utils.ts";
import { getOS } from "./os.utils.ts";
import * as path from "@std/path";
import { OS } from "@shared/enums/os.enums.ts";

/**
 * @deprecated
 * @param basePath
 */
export const getTemporalUpdateFilePathname = (basePath?: string): string => {
  const dirPath = basePath ?? getPath();
  const isWindows = getOS() === OS.WINDOWS;

  return path.join(dirPath, "./updater") + (isWindows ? ".ps1" : ".sh");
};

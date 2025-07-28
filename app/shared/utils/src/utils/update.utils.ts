import { getPath } from "./path.utils.ts";
import { getOS } from "./os.utils.ts";
import { OS } from "../enums/main.ts";
import * as path from "@std/path";

export const getTemporalUpdateFilePathname = (
  basePath: string = "",
): string => {
  const dirPath = path.join(getPath(), basePath);
  const isWindows = getOS() === OS.WINDOWS;

  return path.join(dirPath, "./updater") + (isWindows ? ".ps1" : ".sh");
};

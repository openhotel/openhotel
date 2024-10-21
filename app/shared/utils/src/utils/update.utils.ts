import { getPath } from "./path.utils.ts";
import { getOS } from "./os.utils.ts";
import { OS } from "../enums/main.ts";
import * as path from "@std/path";

export const getTemporalUpdateFilePathname = (): string => {
  const dirPath = getPath();
  const isWindows = getOS() === OS.WINDOWS;

  return path.join(dirPath, "./updater") + (isWindows ? ".ps1" : ".sh");
};

export const getSlicedVersion = (version: string): (number | string)[] => {
  if (version.startsWith("v")) version = version.slice(1);
  return version.split(".").map((e: string) => {
    const num = parseInt(e);
    return `${num}` === e ? num : e;
  });
};

import { getPath } from "./path.utils.ts";
import { getOS } from "./os.utils.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";
import { debug, log } from "./log.utils.ts";
import { Envs } from "../types/envs.types.ts";

export const getTemporalUpdateFilePathname = () => {
  const dirPath = getPath();
  const isWindows = getOS() === OS.WINDOWS;

  return path.join(dirPath, "./updater") + (isWindows ? ".ps1" : ".sh");
};

export const getSlicedVersion = (version: string): (number | string)[] =>
  version
    .slice(1)
    .split(".")
    .map((e: string) => {
      const num = parseInt(e);
      return `${num}` === e ? num : e;
    });

export const getLatestVersion = async (envs: Envs): Promise<string | false> => {
  if (envs.isDevelopment) return false;

  try {
    const { tag_name: latestVersion } = await fetch(
      "https://api.github.com/repos/openhotel/openhotel/releases/latest",
    ).then((data) => data.json());

    const [oldMajor, oldMinor, oldPatch, oldExtra] = getSlicedVersion(
      envs.version,
    );
    const [newMajor, newMinor, newPatch, newExtra] =
      getSlicedVersion(latestVersion);

    if (
      oldMajor >= newMajor &&
      oldMinor >= newMinor &&
      oldPatch >= newPatch &&
      (oldExtra >= newExtra || oldExtra === newExtra)
    ) {
      log("Everything is up to date!");
      return false;
    }

    log(`New version (${latestVersion}) available!`);
    return latestVersion;
  } catch (e) {
    debug(e);
    log("Something went wrong checking for update.");
  }
  return false;
};

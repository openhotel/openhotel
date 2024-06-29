import { ModuleProps } from "shared/types/main.ts";
import {
  debug,
  getOS,
  getOSName,
  getPath,
  getVersion,
  initLog,
  log,
  getTemporalUpdateFilePathname,
  getExecPath,
} from "shared/utils/main.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";

export const load = async (args: ModuleProps): Promise<boolean> => {
  initLog("UPDATER");

  const version = getVersion();
  const os = getOS();
  const osName = getOSName();

  log(`OS ${osName}`);

  if (os === OS.UNKNOWN) {
    log(`Unknown OS (${Deno.build.os}) cannot be updated!`);
    return false;
  }

  log(`Version ${version}`);
  log(`Checking for updates...`);

  try {
    const { tag_name: latestVersion, assets } = await fetch(
      "https://api.github.com/repos/openhotel/openhotel/releases/latest",
    ).then((data) => data.json());

    const getSlicedVersion = (version: string): (number | string)[] =>
      version
        .slice(1)
        .split(".")
        .map((e: string) => {
          const num = parseInt(e);
          return `${num}` === e ? num : e;
        });

    log(version, latestVersion);
    const [oldMajor, oldMinor, oldPatch, oldExtra] = getSlicedVersion(version);
    const [newMajor, newMinor, newPatch, newExtra] =
      getSlicedVersion(latestVersion);

    if (
      oldMajor >= newMajor &&
      oldMinor >= newMinor &&
      oldPatch >= newPatch &&
      oldExtra >= newExtra
    ) {
      log("Everything is up to date!");
      return false;
    }
    log(`New version (${latestVersion}) available!`);

    const osAsset = assets.find(({ name }) => name.includes(osName));

    if (!osAsset) {
      log(`No file found to update on (${osName})!`);
      return false;
    }

    log("Downloading update...");
    const buildAsset = await fetch(osAsset.browser_download_url);

    log("Update downloaded!");
    const dirPath = getPath();
    const updateFilePath = getTemporalUpdateFilePathname();
    const updatedFile = path.join(dirPath, `update.zip`);

    debug(updatedFile);
    log("Saving update!");
    await Deno.writeFile(
      updatedFile,
      new Uint8Array(await buildAsset.arrayBuffer()),
    );

    const isWindows = os === OS.WINDOWS;

    try {
      await Deno.remove(updateFilePath);
    } catch (e) {}

    const ps1 = `#!/usr/bin/env pwsh
    	Start-Sleep -Milliseconds 500
    	Expand-Archive -Force -LiteralPath "${updatedFile}" -DestinationPath "${dirPath}"
    `;
    const bash = `#! /bin/bash
    	unzip -o '${updatedFile}' -d '${dirPath}'`;

    log("Updating...");
    await Deno.writeTextFile(updateFilePath, isWindows ? ps1 : bash, {
      mode: 0x0777,
      create: true,
    });

    if (os === OS.WINDOWS) {
      Deno.run({
        cmd: ["powershell", updateFilePath],
        stdin: "null",
        stdout: "null",
        stderr: "null",
        detached: true,
      });
    } else {
      const updater = Deno.run({
        cmd: ["sh", updateFilePath],
        stdin: "null",
        stdout: "null",
        stderr: "null",
        detached: true,
      });
      await updater.status();
    }
    log("Restart to apply the update!");
    return true;
  } catch (e) {
    debug(e);
    log("Something went wrong checking for update.");
  }
  return false;
};

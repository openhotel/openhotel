import { ConfigTypes, Envs } from "shared/types/main.ts";
import {
  debug,
  getOS,
  getOSName,
  getPath,
  log,
  getTemporalUpdateFilePathname,
} from "shared/utils/main.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";

export const load = async ({ envs }: { envs: Envs }): Promise<boolean> => {
  if (envs.isDevelopment) return false;

  const os = getOS();
  const osName = getOSName();

  log(`OS ${osName}`);

  if (os === OS.UNKNOWN) {
    log(`Unknown OS (${Deno.build.os}) cannot be updated!`);
    return false;
  }

  log(`Version ${envs.version}`);
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

    log("Saving update!");
    await Deno.writeFile(
      updatedFile,
      new Uint8Array(await buildAsset.arrayBuffer()),
      {
        mode: 0x777,
      },
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

    if (isWindows) {
      //TODO #7 auto-updater not working on windows, because the file is already in use by this execution
      log("Run ./updater.ps1 to apply the update and then start again!");
      return true;
    }

    log("Updating...");
    await Deno.writeTextFile(updateFilePath, isWindows ? ps1 : bash, {
      mode: 0x0777,
      create: true,
    });

    const updater = Deno.run({
      cmd: [isWindows ? "powershell" : "sh", updateFilePath],
      stdin: "null",
      stdout: "null",
      stderr: "null",
      detached: true,
    });
    await updater.status();
    log("Restart to apply the update!");
    return true;
  } catch (e) {
    debug(e);
    log("Something went wrong checking for update.");
  }
  return false;
};

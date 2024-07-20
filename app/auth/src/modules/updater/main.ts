import { Envs } from "shared/types/main.ts";
import {
  getOS,
  getOSName,
  getPath,
  getTemporalUpdateFilePathname,
} from "shared/utils/main.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";

export const load = async (envs: Envs): Promise<boolean> => {
  if (envs.version === "DEVELOPMENT") return false;

  const os = getOS();
  const osName = getOSName();

  console.log(`OS ${osName}`);

  if (os === OS.UNKNOWN) {
    console.log(`Unknown OS (${Deno.build.os}) cannot be updated!`);
    return false;
  }

  console.log(`Version ${envs.version}`);
  console.log(`Checking for updates...`);

  try {
    const { tag_name: latestVersion, assets } = await fetch(
      "https://api.github.com/repos/openhotel/auth/releases/latest",
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
      console.log("Everything is up to date!");
      return false;
    }
    console.log(`New version (${latestVersion}) available!`);

    const osAsset = assets.find(({ name }) => name.includes(osName));

    if (!osAsset) {
      console.log(`No file found to update on (${osName})!`);
      return false;
    }

    console.log("Downloading update...");
    const buildAsset = await fetch(osAsset.browser_download_url);

    console.log("Update downloaded!");
    const dirPath = getPath();
    const updateFilePath = getTemporalUpdateFilePathname();
    const updateFile = path.join(dirPath, `${osAsset.name}_update`);
    const updatedFile = path.join(dirPath, osAsset.name);

    console.log("Saving update!", updateFile);
    await Deno.writeFile(
      updateFile,
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
    	if (Test-Path "${updatedFile}") {
        Remove-Item "${updatedFile}" -verbose
      }
      Move-Item -Path "${updateFile}" -Destination "${updatedFile}"
    `;
    const bash = `#! /bin/bash
      touch '${updatedFile}' && rm '${updatedFile}'
    	mv '${updateFile}' '${updatedFile}'`;

    if (isWindows) {
      //TODO #7 auto-updater not working on windows, because the file is already in use by this execution
      console.log(
        "Run ./updater.ps1 to apply the update and then start again!",
      );
      return true;
    }

    console.log("Updating...");
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
    console.log("Restart to apply the update!");
    return true;
  } catch (e) {
    console.debug(e);
    console.log("Something went wrong checking for update.");
  }
  return false;
};

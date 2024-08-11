import { ConfigTypes, Envs } from "shared/types/main.ts";
import {
  debug,
  getOS,
  getOSName,
  getPath,
  log,
  getTemporalUpdateFilePathname,
  getSlicedVersion,
} from "shared/utils/main.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";

let isUpdating = false;

export const load = async ({
  config,
  envs,
}: {
  config: ConfigTypes;
  envs: Envs;
}): Promise<boolean> => {
  if (envs.isDevelopment || isUpdating || config.version === "development")
    return false;
  isUpdating = true;

  const os = getOS();
  const osName = getOSName();
  let arch = Deno.build.arch;

  log(`OS ${osName}`);
  log(`Arch ${arch}`);

  if (os === OS.UNKNOWN) {
    log(`Unknown OS (${Deno.build.os}) cannot be updated!`);
    isUpdating = false;
    return false;
  }

  const targetVersion = config.version;
  if (targetVersion === envs.version) {
    log("Everything is up to date!");
    isUpdating = false;
    return false;
  }
  const isLatest = targetVersion === "latest";

  log(
    isLatest
      ? `Checking for updates...`
      : `Checking version (${targetVersion})...`,
  );

  try {
    const { tag_name: latestVersion, assets } = await fetch(
      `https://api.github.com/repos/openhotel/openhotel/releases/${isLatest ? "latest" : `tags/${targetVersion}`}`,
    ).then((data) => data.json());

    const [oldMajor, oldMinor, oldPatch, oldExtra] = getSlicedVersion(
      envs.version,
    );
    const [newMajor, newMinor, newPatch, newExtra] =
      getSlicedVersion(latestVersion);

    if (isLatest) {
      if (
        oldMajor >= newMajor &&
        oldMinor >= newMinor &&
        oldPatch >= newPatch &&
        (oldExtra >= newExtra || oldExtra === newExtra)
      ) {
        log("Everything is up to date!");
        isUpdating = false;
        return false;
      }
      log(`New version (${latestVersion}) available!`);
    } else {
      log(`Version (${latestVersion}) available!`);
    }

    if (arch !== "aarch64") arch = null;

    const osAsset = assets.find(
      ({ name }) =>
        name.includes(osName) && (arch === null || name.includes(arch)),
    );

    if (!osAsset) {
      log(`No file found to update on (${osName})!`);
      isUpdating = false;
      return false;
    }

    log("Downloading update files...");
    const buildAsset = await fetch(osAsset.browser_download_url);

    log("Update files downloaded!");
    const dirPath = getPath();
    const updateFilePath = getTemporalUpdateFilePathname();
    const updatedFile = path.join(dirPath, `update.zip`);

    log("Saving update files!");
    await Deno.writeFile(
      updatedFile,
      new Uint8Array(await buildAsset.arrayBuffer()),
      {
        mode: 0x777,
      },
    );
    await Deno.chmod(updatedFile, 0o777);

    const isWindows = os === OS.WINDOWS;

    try {
      await Deno.remove(updateFilePath);
    } catch (e) {}

    const ps1 = `#!/usr/bin/env pwsh
    	Start-Sleep -Milliseconds 500
    	Expand-Archive -Force -LiteralPath "${updatedFile}" -DestinationPath "${dirPath}"
    `;
    const bash = `#! /bin/bash
    	unzip -o '${updatedFile}' -d '${dirPath}'
      chmod -R 777 ${dirPath}
    `;

    if (isWindows) {
      //TODO #7 auto-updater not working on windows, because the file is already in use by this execution
      log("Run ./updater.ps1 to apply the update and then start again!");
      isUpdating = false;
      return true;
    }

    log("Updating...");
    await Deno.writeTextFile(updateFilePath, isWindows ? ps1 : bash, {
      mode: 0o0777,
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
    isUpdating = false;
    return true;
  } catch (e) {
    debug(e);
    log("Something went wrong checking for update.");
  }
  isUpdating = false;
  return false;
};

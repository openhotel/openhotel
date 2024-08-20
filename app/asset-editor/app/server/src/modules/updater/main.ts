import {
  getOS,
  getOSName,
  getPath,
  getTemporalUpdateFilePathname,
} from "shared/utils/main.ts";
import { OS } from "shared/enums/main.ts";
import * as path from "deno/path/mod.ts";
import { isDevelopment } from "shared/utils/environment.utils.ts";
import { Envs } from "shared/types/envs.types.ts";

export const load = async (envs: Envs): Promise<boolean> => {
  if (isDevelopment()) return false;

  const os = getOS();
  const osName = getOSName() as string;

  console.log(`OS ${osName}`);

  if (os === OS.UNKNOWN) {
    console.log(`Unknown OS (${Deno.build.os}) cannot be updated!`);
    return false;
  }

  console.log(`Version ${envs.version}`);
  console.log(`Checking for updates...`);

  try {
    const { tag_name: latestVersion, assets } = await fetch(
      "https://api.github.com/repos/openhotel/asset-editor/releases/latest",
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

    const osAsset = assets.find(({ name }: { name: string }) =>
      name.includes(osName),
    );

    if (!osAsset) {
      console.log(`No file found to update on (${osName})!`);
      return false;
    }

    console.log("Downloading update...");
    const buildAsset = await fetch(osAsset.browser_download_url);

    console.log("Update downloaded!");
    const dirPath = getPath();
    const updateFilePath = getTemporalUpdateFilePathname();
    const currentFile = path.join(dirPath, `assets_editor_${osName}`);
    const updatedFile = path.join(dirPath, `update__assets_editor_${osName}`);

    console.log("Saving update files!");
    await Deno.writeFile(
      updatedFile,
      new Uint8Array(await buildAsset.arrayBuffer()),
      {
        mode: 0x777,
      },
    );
    await Deno.chmod(updatedFile, 0o777);

    try {
      await Deno.remove(updateFilePath);
    } catch (e) {}

    const bash = `#! /bin/bash
      rm ${currentFile}
    	mv '${updatedFile}' '${currentFile}'
    `;

    console.log("Updating...");
    await Deno.writeTextFile(updateFilePath, bash, {
      mode: 0x0777,
      create: true,
    });

    const updater = Deno.run({
      cmd: ["sh", updateFilePath],
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

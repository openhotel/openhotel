import {
  getModulePath,
  getOS,
  getOSName,
  getTemporalUpdateFilePathname,
} from "../utils/main.ts";
import { OS } from "../enums/main.ts";
import * as path from "@std/path";
import type {
  GithubAsset,
  LatestVersionProps,
  UpdateProps,
} from "../types/update.types.ts";
import { isNewVersionGreater } from "../utils/version.utils.ts";

let isUpdating = false;

export const update = async ({
  version,
  targetVersion,
  repository,
  headers = {},
  log = () => {},
  debug = () => {},
  label = "-",
}: UpdateProps): Promise<boolean> => {
  if (isUpdating || version === "development") return false;
  isUpdating = true;

  const os = getOS();
  const osName = getOSName();
  let arch: "x86_64" | "aarch64" | null = Deno.build.arch;

  log(`[${label}] Version ${version}`);
  log(`[${label}] OS ${osName}`);
  log(`[${label}] Arch ${arch}`);

  if (os === OS.UNKNOWN || !osName) {
    log(`[${label}] Unknown OS (${Deno.build.os}) cannot be updated!`);
    isUpdating = false;
    return false;
  }

  if (targetVersion === version) {
    log(`[${label}] Everything is up to date! (${label})`);
    isUpdating = false;
    return false;
  }
  const isLatest = targetVersion === "latest";

  log(
    isLatest
      ? `[${label}] Checking for updates...`
      : `[${label}] Checking version (${targetVersion})...`,
  );

  try {
    const $headers = new Headers();
    for (const key of Object.keys(headers)) $headers.append(key, headers[key]);

    $headers.append("X-GitHub-Api-Version", `2022-11-28`);
    $headers.append("Accept", `application/json`);
    $headers.append(
      "User-Agent",
      `Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0`,
    );
    $headers.append("Accept-Encoding", `br, deflate, gzip, x-gzip`);

    const { tag_name: latestVersion, assets } = await fetch(
      `https://api.github.com/repos/${repository}/releases/${isLatest ? "latest" : `tags/${targetVersion}`}`,
      {
        headers: $headers,
      },
    ).then((data) => data.json());

    if (isLatest) {
      if (!isNewVersionGreater(version, latestVersion)) {
        log(`[${label}] Everything is up to date!`);
        isUpdating = false;
        return false;
      }
      log(`[${label}] New version (${latestVersion}) available!`);
    } else {
      log(`[${label}] Version (${latestVersion}) available!`);
    }

    if (arch !== "aarch64") arch = null;

    const osAsset = (assets as GithubAsset[]).find(
      ({ name }) =>
        name.includes(osName) && (arch === null || name.includes(arch)),
    );

    if (!osAsset) {
      log(`[${label}] No file found to update on (${osName})!`);
      isUpdating = false;
      return false;
    }
    $headers.set("Accept", "application/octet-stream");

    log(`[${label}] Downloading update files...`);
    const buildAsset = await fetch(osAsset.url, {
      headers: $headers,
    });

    log(`[${label}] Update files downloaded!`);
    const dirPath = getModulePath("");
    const updateFilePath = getTemporalUpdateFilePathname();
    const updateFile = path.join(dirPath, `update_${osAsset.name}`);
    const updatedFile = path.join(dirPath, osAsset.name);

    log(`[${label}] Saving update files!`);
    await Deno.writeFile(
      updateFile,
      new Uint8Array(await buildAsset.arrayBuffer()),
      {
        mode: 0x777,
      },
    );
    await Deno.chmod(updateFile, 0o777);

    try {
      await Deno.remove(updateFilePath);
    } catch (e) {}

    const bash = osAsset.name.includes(".zip")
      ? `#! /bin/bash
    	unzip -o '${updateFile}' -d '${dirPath}'
      chmod -R 777 ${dirPath}
    `
      : `#! /bin/bash
      touch '${updatedFile}' && rm '${updatedFile}'
    	mv '${updateFile}' '${updatedFile}'
    	chmod -R 777 ${updatedFile}
    `;

    log(`[${label}] Updating...`);
    await Deno.writeTextFile(updateFilePath, bash, {
      mode: 0o0777,
      create: true,
    });

    const command = new Deno.Command("sh", {
      args: [updateFilePath],
      stdin: "null",
      stdout: "null",
      stderr: "null",
    });

    const process = command.spawn();
    await process.status;

    log(`[${label}] Restart to apply the update!`);
    isUpdating = false;
    return true;
  } catch (e) {
    debug(e);
    log(`[${label}] Something went wrong checking for update.`);
  }
  isUpdating = false;
  return false;
};

export const getLatestVersion = async ({
  version,
  repository,
  headers = {},
  log = () => {},
  debug = () => {},
}: LatestVersionProps): Promise<string | null> => {
  try {
    const $headers = new Headers();
    for (const key of Object.keys(headers)) $headers.append(key, headers[key]);

    $headers.append("X-GitHub-Api-Version", `2022-11-28`);
    $headers.append("Accept", `application/json`);
    $headers.append(
      "User-Agent",
      `Mozilla/5.0 (X11; Linux x86_64; rv:128.0) Gecko/20100101 Firefox/128.0`,
    );

    const { tag_name: latestVersion } = await fetch(
      `https://api.github.com/repos/${repository}/releases/latest`,
      {
        headers: $headers,
      },
    ).then((data) => data.json());

    if (!isNewVersionGreater(version, latestVersion)) {
      log("Everything is up to date!");
      return null;
    }

    log(`New version (${latestVersion}) available!`);
    return latestVersion;
  } catch (e) {
    debug(e);
    log("Something went wrong checking for update.");
  }
  return null;
};

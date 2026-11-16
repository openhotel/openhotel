import { getArch, getOS } from "@shared/utils/os.utils.ts";
import { GithubResponse, UpdatedModule } from "@shared/types/updater.types.ts";
import { isNewVersionGreater } from "@shared/utils/versions.utils.ts";
import { getReleaseFileFromBytes } from "@shared/utils/releases.utils.ts";
import { UPDATER_OS } from "@shared/consts/updater.consts.ts";
import { Arch, OS } from "@shared/enums/os.enums.ts";
import { getGithubHeaders } from "@shared/utils/updater.utils.ts";
import { getModulePath } from "@shared/utils/path.utils.ts";
import { replaceFilesAndFoldersFromZip } from "@shared/utils/zip.utils.ts";
import { ReleaseProject } from "@shared/types/releases.types.ts";

export const updaterModule: UpdatedModule = () => {
  let canUpdate = false;
  let log: typeof console.log;
  let project: ReleaseProject;

  const repository = "openhotel/openhotel";

  const load: ReturnType<UpdatedModule>["load"] = ({
    log: $log,
    project: $project,
  }) => {
    log = $log;
    project = $project;

    const os = getOS();
    const arch = getArch();
    canUpdate = os === OS.LINUX && arch === Arch.X64;

    log(
      `System ${os} (${arch})` + canUpdate
        ? ""
        : " not compatible with auto-update!",
    );
    return canUpdate;
  };

  const update: ReturnType<UpdatedModule>["update"] = async ({
    version,
    target,
    preReleases = false,
    stopOnUpdate = true,
  }) => {
    if (!canUpdate) return false;

    if (version === "development" || target === "development") {
      log("Development mode, cannot update!");

      return false;
    }

    const latest = target === "latest";
    if (!latest && version === target) {
      log("Up to date!");
      return false;
    }

    log(
      latest
        ? "Checking for updates..."
        : `Checking version (${target}) for an update...`,
    );

    try {
      const url = latest
        ? preReleases
          ? `https://api.github.com/repos/${repository}/releases?per_page=1`
          : `https://api.github.com/repos/${repository}/releases/latest`
        : `https://api.github.com/repos/${repository}/releases/tags/${target}`;

      const releaseResponse = await fetch(url, { headers: getGithubHeaders() });
      if (!releaseResponse.ok) {
        log(`GitHub API failed ${releaseResponse.status} (${target})!`);
        return false;
      }

      const data = await releaseResponse.json();
      const release = (latest && preReleases ? data[0] : data) as
        GithubResponse | undefined;

      if (!release) {
        log("No releases found!");
        return false;
      }
      const { tag_name: latestVersion, assets } = release;

      if (latest && !isNewVersionGreater(version, latestVersion)) {
        log("Up to date!");
        return false;
      }

      const releaseGithubAsset = assets.find(
        ({ name }) => name === "release.oh",
      );
      if (!releaseGithubAsset) {
        log(`Release file not found (${latestVersion})!`);
        return false;
      }

      const buildAsset = await fetch(releaseGithubAsset.url, {
        headers: getGithubHeaders("application/octet-stream"),
      });

      if (!buildAsset.ok) {
        log(
          `Release file cannot be downloaded ${buildAsset.status} (${latestVersion})!`,
        );
        return false;
      }

      const releaseData = getReleaseFileFromBytes(
        new Uint8Array(await buildAsset.arrayBuffer()),
      );

      if (!releaseData) {
        log(`Release file cannot be read (${latestVersion})!`);
        return false;
      }

      const remoteVersion = releaseData.get(project);
      if (!remoteVersion) {
        log(`Release file does not contain ${project} (${latestVersion})!`);
        return false;
      }

      if (
        latest
          ? !isNewVersionGreater(version, remoteVersion)
          : version === remoteVersion
      ) {
        log("Up to date!");
        return false;
      }

      const updateAsset = assets.find(
        ({ name }) => name === `${project}_${UPDATER_OS}.zip`,
      );

      if (!updateAsset) {
        console.log(
          `Update asset not found on project ${project} (${remoteVersion})`,
        );
        return false;
      }

      log(`Update found (${remoteVersion})!`);
      log(`Downloading project update file...`);
      const projectFileResponse = await fetch(updateAsset.url, {
        headers: getGithubHeaders("application/octet-stream"),
      });

      if (!projectFileResponse.ok) {
        log(
          `Project update file cannot be downloaded ${projectFileResponse.status} (${remoteVersion})!`,
        );
        return false;
      }

      log(`Project update file downloaded!`);

      const currentPath = getModulePath();
      const projectUpdateZipData = new Uint8Array(
        await projectFileResponse.arrayBuffer(),
      );

      const filesAndFoldersReplaces = await replaceFilesAndFoldersFromZip(
        projectUpdateZipData,
        currentPath,
      );
      log(
        `Project files/folder updates (${filesAndFoldersReplaces.join(", ")})!`,
      );

      if (stopOnUpdate)
        //@ts-ignore
        Deno.exit(0);

      log("Restart to apply the update!");
      return true;
    } catch (e) {
      console.error(e);
      return false;
    }
  };

  return {
    load,
    update,
  };
};

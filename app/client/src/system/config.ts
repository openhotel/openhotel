import { ConfigTypes } from "shared/types";
import { getChangesBetweenVersions, parseChangelog } from "../shared/utils";

const FIRST_PUBLIC_VERSION = "v0.0.35";

export const config = () => {
  let $config: ConfigTypes;
  let $lastVersion = "v0.0.0";

  const load = async () => {
    $config = (await (await fetch("/info")).json()).data;

    $config.version = "v0.5.27"; // TODO: remove
    $lastVersion = "v0.5.22"; // localStorage.getItem("version"); // TODO: change
    localStorage.setItem("version", $config.version);

    console.log($lastVersion, $config.version);
    // TODO: compare versions and launch modal with specific changelog
  };

  const get = (): ConfigTypes => $config;

  const isDevelopment = () => $config.version === "development";
  const getVersion = () => $config.version;

  const getChangelogChanges = async (all: boolean = false) => {
    if ($lastVersion !== $config.version) {
      const rawChangelog = await fetch("/CHANGELOG.md").then((response) =>
        response.text(),
      );

      const changelog = parseChangelog(rawChangelog);
      return getChangesBetweenVersions(
        changelog,
        all ? FIRST_PUBLIC_VERSION : $lastVersion,
        $config.version,
      );
    }
  };

  return {
    load,
    get,

    isDevelopment,
    getVersion,
    getChangelogChanges,
  };
};

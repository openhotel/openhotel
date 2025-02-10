import { ConfigTypes } from "shared/types";
import { getChangesBetweenVersions, parseChangelog } from "../shared/utils";

const FIRST_PUBLIC_VERSION = "v0.0.35";

export const config = () => {
  let $config: ConfigTypes;
  let $lastVersion = "v0.0.0";

  const load = async () => {
    $config = (await (await fetch("/info")).json()).data;

    $lastVersion = localStorage.getItem("version");
    localStorage.setItem("version", $config.version);
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
      if (!changelog.length) return;

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

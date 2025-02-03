import { getChangesBetweenVersions, parseChangelog } from "../shared/utils";

export const version = () => {
  let $version = "v0.0.0";
  let $lastVersion = "v0.0.0";

  const $firstVersion = "v0.0.35";

  const load = async () => {
    const { data } = await fetch(`/version`).then((response) =>
      response.json(),
    );
    $version = data.version;
    $version = "v0.5.27"; // TODO: remove

    $lastVersion = "v0.5.22"; // localStorage.getItem("version"); // TODO: change
    localStorage.setItem("version", $version);
  };

  const isDevelopment = () => $version === "development";
  const getVersion = () => $version;
  const getChangelogChanges = async (all: boolean = false) => {
    if ($lastVersion !== $version) {
      const rawChangelog = await fetch("/CHANGELOG.md").then((response) =>
        response.text(),
      );

      const changelog = parseChangelog(rawChangelog);
      return getChangesBetweenVersions(
        changelog,
        all ? $firstVersion : $lastVersion,
        $version,
      );
    }
  };

  return {
    load,
    isDevelopment,
    getVersion,
    getChangelogChanges,
  };
};

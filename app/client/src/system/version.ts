import { getChangesBetweenVersions, parseChangelog } from "../shared/utils";

export const version = () => {
  let $version = "v0.0.0";

  const load = async () => {
    const { data } = await fetch(`/version`).then((response) =>
      response.json(),
    );
    $version = data.version;
    $version = "v0.5.27"; // TODO: remove

    const lastVersion = "v0.5.22"; // localStorage.getItem("version"); // TODO: change
    localStorage.setItem("version", $version);

    if (lastVersion !== $version) {
      const rawChangelog = await fetch("/CHANGELOG.md").then((response) =>
        response.text(),
      );

      const changelog = parseChangelog(rawChangelog);
      const changes = getChangesBetweenVersions(
        changelog,
        lastVersion,
        $version,
      );
      console.log(changes);
      // TODO: launch modal with specific changelog
    }
  };

  const isDevelopment = () => $version === "development";
  const getVersion = () => $version;

  return {
    load,
    isDevelopment,
    getVersion,
  };
};

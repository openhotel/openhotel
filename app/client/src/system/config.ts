import { ConfigTypes } from "shared/types";

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

  const getChangelogChanges = async () => {
    if ($lastVersion !== null && $lastVersion !== $config.version) {
      return (await (await fetch(`/changelog?from=${$lastVersion}`)).json())
        .data;
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

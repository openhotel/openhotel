import { ConfigTypes } from "shared/types";

export const config = () => {
  let $config: ConfigTypes;

  const load = async () => {
    $config = (await (await fetch("/info")).json()).data;

    const lastVersion = localStorage.getItem("version");
    localStorage.setItem("version", $config.version);

    console.log(lastVersion, $config.version);
    // TODO: compare versions and launch modal with specific changelog
  };

  const get = (): ConfigTypes => $config;

  const isDevelopment = () => $config.version === "development";
  const getVersion = () => $config.version;

  return {
    load,
    get,

    isDevelopment,
    getVersion,
  };
};

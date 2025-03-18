import { ConfigTypes } from "shared/types";

export const config = () => {
  let $config: ConfigTypes;
  let $changeLog: unknown;

  const load = () => {};

  const set = (config: ConfigTypes) => {
    $config = config;
  };
  const get = () => $config;

  const setChangeLog = (changeLog: unknown) => {
    $changeLog = changeLog;
  };
  const getChangelog = () => $changeLog;

  const isDevelopment = () => $config.version === "development";

  return {
    load,

    set,
    get,

    setChangeLog,
    getChangelog,

    isDevelopment,
  };
};

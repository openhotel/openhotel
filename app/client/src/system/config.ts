import { ConfigTypes } from "shared/types";

export const config = () => {
  let config: ConfigTypes;

  const load = async () => {
    config = (await (await fetch("/config")).json()).data;
  };

  const get = (): ConfigTypes => config;

  return {
    load,
    get,
  };
};

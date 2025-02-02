import { readYaml } from "@oh/yaml";
import { ConfigTypes } from "../src/shared/types/config.types.ts";

export const fetcher = async (pathname: string, init?: RequestInit) =>
  fetch(`${await getUrl()}${pathname}`, init).then((response) =>
    response.json(),
  );

export const getUrl = async () => {
  const config = await readYaml<ConfigTypes>(`../config.yml`);
  return `http://0.0.0.0:${config.port * (config.version === "development" ? 10 : 1)}/api/v3`;
};

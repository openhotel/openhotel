import { parse } from "jsr:@std/yaml";
import { ConfigTypes } from "../src/shared/types/config.types.ts";

export const fetcher = async (pathname: string, init?: RequestInit) =>
  fetch(`${await getUrl()}${pathname}`, init).then((response) =>
    response.json(),
  );

export const getUrl = async () => {
  const config = parse(await Deno.readTextFile("../config.yml")) as ConfigTypes;
  return `http://0.0.0.0:${config.port * (config.version === "development" ? 10 : 1)}/api/v3`;
};

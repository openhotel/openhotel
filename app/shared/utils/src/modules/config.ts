import { readYaml, writeYaml } from "./yaml.ts";
import type { ConfigProps } from "../types/config.types.ts";
import { join } from "@std/path";

export const getConfig = async <ConfigTypes extends {}>({
  values,
  defaults,
  fileName = "config.yml",
  pathName = "./",
}: ConfigProps<ConfigTypes>): Promise<ConfigTypes> => {
  let config: ConfigTypes = {} as ConfigTypes;
  const pathFileName = join(pathName, fileName);
  try {
    //@ts-ignore
    config = await readYaml<ConfigTypes>(pathFileName);
  } catch (e) {}

  const $defaults: any = defaults;

  const setValue = (def: any, val: any, con: any) => {
    for (const key of Object.keys(def)) {
      if (typeof def[key] === "object" && !Array.isArray(def[key])) {
        setValue(def[key], val?.[key], con?.[key]);
        continue;
      }
      def[key] = val?.[key] ?? con?.[key] ?? def[key];
    }
  };

  setValue(defaults, values, config);
  try {
    await writeYaml<ConfigTypes>(pathFileName, $defaults);
  } catch (e) {}

  return $defaults;
};

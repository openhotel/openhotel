import { readYaml, writeYaml } from "./yaml.ts";
import type { ConfigProps } from "../types/config.types.ts";

export const getConfig = async <ConfigTypes extends {}>({
  values,
  defaults,
  fileName = "config.yml",
}: ConfigProps<ConfigTypes>): Promise<ConfigTypes> => {
  let config: ConfigTypes = {} as ConfigTypes;
  try {
    //@ts-ignore
    config = await readYaml<ConfigTypes>(`./${fileName}`);
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
    await writeYaml<ConfigTypes>(`./${fileName}`, $defaults);
  } catch (e) {}

  return $defaults;
};

import { getBeautyDate } from "@oh/utils";
import { ConfigTypes } from "shared/types/config.types.ts";

export const initLog = (config: ConfigTypes) => {
  if (config?.development) return;
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`${getBeautyDate()}`, "|", ...messages);
};

export const debug = (...messages: string[]) => {
  console.info(`> ${getBeautyDate()}`, "|", ...messages);
};

import { getBeautyDate } from "./date.utils.ts";
import { Envs } from "shared/types/envs.types.ts";

export const initLog = (envs: Envs) => {
  if (envs.isDevelopment) return;
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`${getBeautyDate()}`, "|", ...messages);
};

export const debug = (...messages: string[]) => {
  console.info(`> ${getBeautyDate()}`, "|", ...messages);
};

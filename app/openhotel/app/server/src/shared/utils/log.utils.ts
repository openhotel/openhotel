import { System } from "modules/system/main.ts";
import { getBeautyDate } from "@shared/utils/date.utils.ts";

export const initLog = () => {
  if (System.getEnvs().version === "development") return;
  console.log = () => {};
};

export const log = (...messages: string[]) => {
  console.info(`${getBeautyDate()}`, "|", ...messages);
};

export const debug = (...messages: string[]) => {
  console.info(`> ${getBeautyDate()}`, "|", ...messages);
};

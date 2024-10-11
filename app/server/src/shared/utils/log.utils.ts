import { getBeautyDate } from "@oh/utils";
import { System } from "modules/system/main.ts";

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
